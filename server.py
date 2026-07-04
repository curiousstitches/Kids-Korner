import http.server
import socketserver
import os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Kids Korner running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()