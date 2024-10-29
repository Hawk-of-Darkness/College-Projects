import socket
def tcp_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('localhost', 12345))
    server_socket.listen(5)
    print("TCP Server listening on port 12345...")

    while True:
        client_socket, addr = server_socket.accept()
        print(f"Connection from {addr} established.")
        
        while True:
            message = client_socket.recv(1024).decode()
            if message.lower() == 'exit':
                print(f"Connection with {addr} closed.")
                break
            print(f"Received from client: {message}")
            response = f"Server received: {message}"
            client_socket.sendall(response.encode())

        client_socket.close()
tcp_server()
