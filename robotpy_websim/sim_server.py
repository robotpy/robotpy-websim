

import inspect
import os
from os.path import abspath, dirname, exists, join
import threading
import time
import re
import webbrowser

try:
    import ujson as json
except ImportError:
    import json

import tornado.gen
import tornado.web
from tornado.ioloop import IOLoop, PeriodicCallback
from tornado.websocket import WebSocketHandler

from hal_impl import mode_helpers
from hal_impl.data import hal_data, hal_in_data, update_hal_data
from hal import TalonSRXConst as tsrxc

import logging
logger = logging.getLogger('websim')

def pretty_json(d):
    return json.dumps(d, sort_keys=True, indent=4, separators=(',', ': '))


class SimulationWebSocket(WebSocketHandler):
    """
        This websocket handles simulation communication data. For the moment,
        we only support a single simulation websocket. Additional callers
        will be refused.
        
        A new instance of this object is created for each websocket connection.
    """
    
    has_connection = False
    
    def initialize(self, sim_period):
        self.connected = False
        self.sim_period = sim_period
    
    def open(self):
        if SimulationWebSocket.has_connection:
            self.close(409, "Only a single simulation connection is allowed")
            return
        
        SimulationWebSocket.has_connection = True
        self.connected = True
        self.sim_initialized = False
        
        logger.info("Simulation websocket opened")
        
        # push data to the simulation every 25ms
        self.timer = PeriodicCallback(self._on_timer, self.sim_period)
        self.timer.start()
        
    def init_sim(self):
        '''Initialize the simulation interface'''
        
        mode_helpers.set_mode('teleop', False)
        hal_data['control']['ds_attached'] = True
        hal_in_data['control']['ds_attached'] = True
        
        # send it the initial seed data
        msg = {
            'out': hal_data,
            'in':  hal_in_data
        }
        
        self.write_message(json.dumps(msg, allow_nan=False), False)
        self.sim_initialized = True
    
    def _on_timer(self):
        '''Called every N ms'''
        
        if self.sim_initialized:
            self.write_message(json.dumps(hal_data, allow_nan=False), False)
        elif hal_data['user_program_state'] is not None:
            self.init_sim()
    
    def on_message(self, message):
        '''Called on incoming messages from the simulation. Incoming messages
        are JSON encoded, with a 'msgtype' field. The rest of the JSON depends
        on what 'msgtype' is.
        
        Current values for msgtype:
        
        * input: Then 'data' is filled with data to be updated in HAL
        * mode: then 'mode' and 'enabled' are set
        
        '''
        msg = json.loads(message)
        
        msgtype = msg['msgtype']
        
        if msgtype == 'input':
            update_hal_data(msg['data'])
        elif msgtype == 'mode':
            mode_helpers.set_mode(msg['mode'], msg['enabled'])
        
        # ignore other types for now... 
    
    def on_close(self):
        logger.info("Simulation websocket closed")
        if self.connected:
            SimulationWebSocket.has_connection = False
            self.connected = False
            
            if self.timer is not None:
                self.timer.stop()
            
            # This automagically disables, actually
            hal_data['control']['ds_attached'] = False
            hal_in_data['control']['ds_attached'] = False

class ApiHandler(tornado.web.RequestHandler):

    def initialize(self, root_path, sim_path):
        
        # Root directory of HTML content that is packaged with this simulator
        self.root_path = root_path
        
        # Root directory of HTML content that is provided by the user
        self.sim_path = sim_path

        self.builtin_module_path = join(self.root_path, 'modules')
        self.user_module_path = join(self.sim_path, 'modules')

    def _builtin_to_web_path(self, path):
        return path[len(self.root_path):]

    def _user_to_web_path(self, path):
        return '/user' + path[len(self.sim_path):]

    def get(self, param):
        '''
            GET handler
            
            Don't call this often, as it may block the tornado ioloop, which
            would be bad.. 
            
            :param param: The matching parameter for /api/(.*)
        '''
        
        if param == 'can_mode_map':
            can_mode_map = {
                        tsrxc.kMode_CurrentCloseLoop: 'PercentVbus',
                        tsrxc.kMode_DutyCycle:'PercentVbus',
                        tsrxc.kMode_NoDrive:'Disabled',
                        tsrxc.kMode_PositionCloseLoop:'Position',
                        tsrxc.kMode_SlaveFollower:'Follower',
                        tsrxc.kMode_VelocityCloseLoop:'Speed',
                        tsrxc.kMode_VoltCompen:'Voltage'
                     }
            
            self.write(can_mode_map)

        elif param == 'module_list':

            # Not sure if there should be a distinction between these...
            modules = {'builtin': [], 'user': []}

            # Builtin modules
            for path in sorted(os.listdir(self.builtin_module_path)):
                js_path = join(self.builtin_module_path, path, path + '.js')
                if exists(js_path):
                    modules['builtin'].append(self._builtin_to_web_path(js_path))

            # User modules
            if exists(self.user_module_path):
                for path in sorted(os.listdir(self.user_module_path)):
                    js_path = join(self.user_module_path, path, path + '.js')
                    if exists(js_path):
                        modules['user'].append(self._user_to_web_path(js_path))

            self.write(modules)
                
        else:
            raise tornado.web.HTTPError(404)

    def post(self, param):
        '''
            POST handler
            
            Don't call this often, as it may block the tornado ioloop, which
            would be bad..
            
            :param param: The matching parameter for /api/(.*)
        '''
        
        if param == 'config/save':
            
            # We ensure that the data being written is valid JSON
            #data = json.loads(self.request.body.decode('utf-8'))
            data = json.loads(self.get_argument('config'))
            
            # TODO: validate the format of the config file
            
            # TODO: Allow writing portions of the config file? or maybe module specific config files?
            # -> BUT don't allow arbitrary writes to the filesystem when we do that!
            
            # TODO: This blocks, which we shouldn't do.. 
            with open(join(self.sim_path, 'config.json'), 'w') as fp:
                fp.write(pretty_json(data))
                
        elif param == 'user_config/save':
            
            # We ensure that the data being written is valid JSON
            #data = json.loads(self.request.body.decode('utf-8'))
            data = json.loads(self.get_argument('config'))
            
            # TODO: validate the format of the config file
            
            # TODO: Allow writing portions of the config file? or maybe module specific config files?
            # -> BUT don't allow arbitrary writes to the filesystem when we do that!
            
            # TODO: This blocks, which we shouldn't do.. 
            with open(join(self.sim_path, 'user-config.json'), 'w') as fp:
                fp.write(pretty_json(data))
            
        else:
            raise tornado.web.HTTPError(404)


class MyStaticFileHandler(tornado.web.StaticFileHandler):
    '''This serves static files, and disables caching'''

    # This is broken in tornado, disable it
    def check_etag_header(self):
        return False
    
    def set_extra_headers(self, path):
        # Disable cache
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')


class Main:
    '''Entrypoint called from wpilib.run'''
    
    def __init__(self, parser):
        
        parser.add_argument('--sim-period', default=25, type=int,
                            help='Transmit simulation data every N ms')
        parser.add_argument('--port', default=8000, type=int,
                            help='Port for webserver listen on')
        parser.add_argument('--no-launch', default=False, action='store_true',
                            help="Don't automatically launch web browser")
    
    def server_thread(self):
        
        app = tornado.web.Application([
            (r'/api/(.*)', ApiHandler, {'root_path': self.root_path, 'sim_path': self.sim_path}),
            (r'/api', SimulationWebSocket, {'sim_period': self.options.sim_period}),
            (r'/user/(.*)', MyStaticFileHandler, {'path': self.sim_path }),
            (r"/()", MyStaticFileHandler, {"path": join(self.root_path, 'index.html')}),
            (r"/(.*)", MyStaticFileHandler, {'path': self.root_path })
        ])
        
        print("Listening on http://localhost:%s/" % self.options.port)
        app.listen(self.options.port, address='127.0.0.1')
        
        if self.launch_thread is not None:
            self.launch_thread.start()
        
        IOLoop.instance().start()
    
    def launch_browser(self):
        try:
            time.sleep(1.0)
            w = None
            
            # Prefer chrome if available
            for b in ['chrome', 'google-chrome', 'chromium', 'chromium-browser']:
                if w is not None:
                    break
                try:
                    w = webbrowser.get(using=b)
                except:
                    pass
            
            if w is None:
                w = webbrowser.get()
            
            w.open('http://localhost:%s/' % self.options.port)
        except:
            logger.exception("Unexpected error trying to open browser automatically")
        
        return False
        
    def terrible_hack(self):
        # This terrible hack allows the DS thread to receive new joystick data
        while True:
            mode_helpers.notify_new_ds_data()
            time.sleep(0.02)
    
    def run(self, options, robot_class, **kwargs):
        
        self.options = options
            
        # Path where files are served from
        self.root_path = abspath(join(dirname(__file__), 'html'))
        
        # Path where user files are served from
        robot_file = abspath(inspect.getfile(robot_class))
        robot_path = dirname(robot_file)
        
        self.sim_path = join(robot_path, 'sim')
        if not exists(self.sim_path):
            os.mkdir(self.sim_path)
            
        if self.options.no_launch:
            self.launch_thread = None
        else:
            self.launch_thread = threading.Thread(target=self.launch_browser, daemon=True)
        
        server_thread = threading.Thread(target=self.server_thread, daemon=True)
        server_thread.start()
        
        hack_thread = threading.Thread(target=self.terrible_hack, daemon=True)
        hack_thread.start()
        
        try:
            return robot_class.main(robot_class)
        finally:
            IOLoop.instance().stop()
            server_thread.join()
