import socket

def udp_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(('localhost', 12345))
    print("UDP Server listening on port 12345...")

    while True:
        data, addr = server_socket.recvfrom(1024)
        message = data.decode()
        print(f"Received from {addr}: {message}")

        if message.lower() == 'exit':
            print("Server shutting down.")
            break
        
        response = f"Server received: {message}"
        server_socket.sendto(response.encode(), addr)

    server_socket.close()

udp_server()
