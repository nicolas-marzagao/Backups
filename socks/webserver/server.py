import socket

'https://www.codementor.io/@joaojonesventura/building-a-basic-http-server-from-scratch-in-python-1cedkg0842'

host = '0.0.0.0'
port = 8080

s = socket.socket(s.AF_INET, s.SOCK_STREAM)
s.setsockopt(s.SOL_SOCKET, s.SO_REUSEADDR, 1)
s.bind((host, port))
s.listen(1)

print('Running Server..')

while True:
    conn, addr = s.accept()
    request = conn.recv(1024).decode()
    print(request)

    response = 'HTTP/1.0 200 OK\n\nHello World!'
    conn.sendall(response.encode())
    conn.close()

s.close()