import socket
from time import sleep

def main():
    host = '0.0.0.0'
    port = 8080

    s = socket.socket()
    s.connect((host, port))

    print("Connected to server!")

    name = input("Input name > ")
    s.send(name.encode())

    message = ""
    while message != "START":
        print("Waiting on opponent to join...")
        message = s.recv(1024).decode()

    pick = input("input rock, paper or scissors: ")
    s.send(pick.encode())

    print(s.recv(1024).decode())

    result = s.recv(1024).decode()

    if result == name:
        print("You Win!")
    elif result == "draw":
        print("Draw!")
    else:
        print("You Lose!")

    s.close()


if __name__ == "__main__":
    main()