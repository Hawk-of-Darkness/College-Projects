import socket

def udp_client():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    while True:
        message = input("Enter a message (type 'exit' to quit): ")
        client_socket.sendto(message.encode(), ('localhost', 12345))
        
        if message.lower() == 'exit':
            break

        response, _ = client_socket.recvfrom(1024)
        print(f"Received from server: {response.decode()}")

    client_socket.close()

udp_client()
