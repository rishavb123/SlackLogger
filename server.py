from http.server import HTTPServer, BaseHTTPRequestHandler
from io import TextIOBase
import sys
import os
import requests

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
 

class RequestHander(BaseHTTPRequestHandler):

    def status_okay(self):
        self.request_code = 200
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def status_not_found(self):
        self.request_code = 404
        self.send_response(404)
        self.wfile.write('Error 404: not found')
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        BaseHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        if self.path == '/favicon.ico':
            self.status_not_found()
            return

        if self.path == '/':
            self.status_okay()
            self.wfile.write('Hello, World!')
        elif self.path == '/test':
            self.status_okay()
            self.wfile.write('Test')
        elif self.path == '/main':
            self.status_okay()
            self.wfile.write('Main')
        else:
            self.status_not_found()

        print("GET " + self.path + " code:" + str(self.request_code))

class Logger:

    def __init__(self):
        pass

    def write(self, s):
        stdout.write(s)
        requests.get(url = 'http://localhost:' + str(PORT + 1), params={ "data": s, "removelns": 'true' })

os.system("start node server.js " + str(PORT + 1))

stdout = sys.stdout
sys.stdout = Logger()

server = HTTPServer(('', PORT), RequestHander)
print('Starting server on port ' + str(PORT))

try:
    server.serve_forever()
except KeyboardInterrupt:
    print('Server Closing . . .')