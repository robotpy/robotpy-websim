

import inspect
import os
from os.path import abspath, dirname, exists, join
import threading
import time
import re

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

    def get(self, param):
        '''
            GET handler
            
            Don't call this often, as it may block the tornado ioloop, which
            would be bad.. 
            
            :param param: The matching parameter for /api/(.*)
        '''
                
        if param == 'hal_data':
 
            
            print(param, '!!!!!!!!!!')
            
            self.write({'out' : hal_data, 'in' : hal_in_data})
        
        else:
            raise tornado.web.HTTPError(404)
    
    def post(self, param):
        '''
            POST handler
            
            Don't call this often, as it may block the tornado ioloop, which
            would be bad..
            
            :param param: The matching parameter for /api/(.*)
        '''
        

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
        IOLoop.instance().start()
        
        
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
        
        server_thread = threading.Thread(target=self.server_thread, daemon=True)
        server_thread.start()
        
        hack_thread = threading.Thread(target=self.terrible_hack, daemon=True)
        hack_thread.start()
        
        try:
            return robot_class.main(robot_class)
        finally:
            IOLoop.instance().stop()
            server_thread.join()
