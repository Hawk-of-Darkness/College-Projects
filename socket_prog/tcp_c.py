import socket

def tcp_client():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('localhost', 12345))
    
    while True:
        message = input("Enter a message (type 'exit' to quit): ")
        client_socket.sendall(message.encode())
        
        if message.lower() == 'exit':
            break
        
        response = client_socket.recv(1024).decode()
        print(f"Received from server: {response}")

    client_socket.close()

tcp_client()
