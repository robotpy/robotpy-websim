
import threading

import http.server
import socketserver

import os
from os.path import abspath, dirname, join
import posixpath
import urllib
from urllib.parse import parse_qs
import time

import json

from hal_impl.mode_helpers import notify_new_ds_data
from hal_impl.data import hal_data

class HTTPHandler(http.server.SimpleHTTPRequestHandler):
    
    # Path where files are served from
    root_path = abspath(join(dirname(__file__), 'html'))
    
    # TODO: allow grafting in the user's config files, etc 
    
    
    def do_GET(self):
        if self.path != '/api/hal_data':
            return super().do_GET()
        
        try:
            data = bytes(json.dumps(hal_data, allow_nan=False), 'utf-8')
        except:
            self.send_error(500, "Internal server error converting JSON")
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(data))
            self.end_headers()
            
            self.wfile.write(data)
        
    def do_POST(self):
        
        if self.path != '/api/hal_data':
            return super().do_POST()
        
        try:
            length = int(self.headers['Content-Length'])
            post_data = parse_qs(self.rfile.read(length).decode('utf-8'))
            
            data = json.loads(post_data['data'][0])
            
            # Probably should use a lock here. Meh.
            hal_data.update(data)
            
        except Exception as e:
            self.send_error(500, str(e))
        else:
            self.send_response(200)
        
        self.send_header('Content-Length', 0)
        self.end_headers()
            
    
    def translate_path(self, path):
        """Translate a /-separated PATH to the local filename syntax.

        Components that mean special things to the local file system
        (e.g. drive or directory names) are ignored.  (XXX They should
        probably be diagnosed.)
        
        Copied from python 3.4.2 implementation, released under same license
        
        """
        # abandon query parameters
        path = path.split('?',1)[0]
        path = path.split('#',1)[0]
        # Don't forget explicit trailing slash when normalizing. Issue17324
        trailing_slash = path.rstrip().endswith('/')
        path = posixpath.normpath(urllib.parse.unquote(path))
        words = path.split('/')
        words = filter(None, words)
        path = self.root_path
        for word in words:
            drive, word = os.path.splitdrive(word)
            head, word = os.path.split(word)
            if word in (os.curdir, os.pardir): continue
            path = os.path.join(path, word)
        if trailing_slash:
            path += '/'
        return path
    
    def log_request(self, code='-', size='-'):
        if '/api' not in self.requestline:
            super().log_request(code, size)
        


class Main:
    
    def __init__(self, parser):
        # TODO: add 
        #parser.add_argument('rootdir', help="Webserver root directory to serve", action='store')
        self.server = None
    
    def server_fn(self):
        
        addr = ('127.0.0.1', 8000)
        
        handler = HTTPHandler
        
        self.server = socketserver.TCPServer(addr, handler, bind_and_activate=False)
        self.server.allow_reuse_address = True
        self.server.server_bind()
        self.server.server_activate()
        
        print("Listening on http://%s:%s" % addr)
        self.server.serve_forever()
        
    def terrible_hack(self):
        
        while True:
            notify_new_ds_data()
            time.sleep(0.02)
    
    def run(self, options, robot_class):
        
        thread = threading.Thread(target=self.server_fn, daemon=True)
        thread.start()
        
        hack_thread = threading.Thread(target=self.terrible_hack, daemon=True)
        hack_thread.start()
        
        try:
            return robot_class.main(robot_class)
        finally:
            if self.server is not None:
                self.server.shutdown()
        