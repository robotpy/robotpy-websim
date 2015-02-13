'''
Created on Feb 3, 2015

@author: amory_000
'''

import socket
import json
import threading
import re


class Data:
    
    _isClient = False
    _client = None
    _lock = threading.RLock()
    _socket = None
    _port = 20307
    _data = ''
    
    
    class DataStream(threading.Thread):
        
        
        def __init__(self):
            super().__init__()
            self._dataBuffer = ''
            self._dataLength = None
            self._data_left_over = False
        
        def recv(self, socket):
            '''
            sdfd
            '''
            #wait until a message length has been given
            while True:
                
                # Don't wait on data if there is still some left over
                if self._data_left_over is False:
                    
                    # wait on new data to come in
                    new_data = bytes.decode(socket.recv(1024))
                    self._dataBuffer += new_data
                    
                    # if nothing was sent just continue
                    if new_data == '':
                        continue

                
                  
                self._data_left_over = False
                    
                if self._dataLength is None:
                    #look for string matching :length:
                    search = re.search(r':[0-9]+:', self._dataBuffer)
                    if search:
                        pattern = search.group()
                        self._dataLength = int(pattern.strip(':'))
                        self._dataBuffer = self._dataBuffer[search.end():]
                    # if pattern was not found then look for incomplete pattern.
                    # Look for last : and remove anything before then. If what
                    # immediately follows is not an integer clear the buffer
                    else:                   
                        lastColon = self._dataBuffer.rfind(':')
                        if lastColon == -1 or not self._dataBuffer[lastColon + 1:].isdecimal():
                            self._dataBuffer = ''
                        
                
                if self._dataLength is not None:
                    
                    if len(self._dataBuffer) >= self._dataLength:
                        
                        data = self._dataBuffer[:self._dataLength]
                        self._dataBuffer = self._dataBuffer[self._dataLength:]
                        if self._dataBuffer != '':
                            self._data_left_over = True
                        self._dataLength = None
                        return data
                    
                    
                    

    
    
    class ServerThread(DataStream):
        
        def __init__(self):
            super().__init__()
        
        def run(self):
            Data._client, addr = Data._socket.accept()
            while True:
                json = self.recv(Data._client)
                Data.updateData(json)
                    
    class ClientThread(DataStream):
        
        def __init__(self):
            super().__init__()
        
        def run(self):
            while True:
                json = self.recv(Data._socket)
                Data.updateData(json)
    
    
    def __init__(self):
        pass
         
    @staticmethod
    def initServer(host = socket.gethostname()):
        if Data._socket:
            return
        
        Data._socket = socket.socket()
        Data._socket.bind((host, Data._port))
        Data._socket.listen(1)
        thread = Data.ServerThread()
        thread.start()
        
        
    @staticmethod
    def initClient(host = socket.gethostname()):
        if Data._socket:
            return
        
        Data._socket = socket.socket()
        Data._socket.connect((host, Data._port))
        thread = Data.ClientThread()
        thread.start()
        
    @staticmethod
    def updateData(data):
        '''
            Update json string
            
            :param data: string or dictionary
        '''
        
        with Data._lock:
            #if dict get json dump
            if isinstance(data, str):
                Data._data = data
            else:
                Data._data = json.dumps(data)
                
        
    @staticmethod
    def sendData():
        if Data.isInitialized():
            message = ':' + str(len(Data._data)) + ':' + Data._data
            Data._socket.sendall(str.encode(message))
        
    @staticmethod
    def getData():
        return Data._data
    
    @staticmethod
    def getDict():
        return json.loads(Data._data)
    
    @staticmethod
    def isInitialized():
        return Data._socket is not None
    
    
    @staticmethod
    def isClient():
        return Data.isInitialized() and Data._isClient
    
    @staticmethod
    def isServer():
        return Data.isInitialized() and Data._isClient is False
    