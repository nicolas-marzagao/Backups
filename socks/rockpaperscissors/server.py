import socket
import threading
from time import sleep

all_threads = []
players_picks = []

def main():
    host = '0.0.0.0'
    port = 8080

    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((host, port))
    s.listen(2)

    try:
        print('Waiting for players to join (0/2)')
        while True:
            conn, addr = s.accept()

            print("Client:", addr)
            
            t = threading.Thread(target=handle_player, args=(conn, addr))
            t.start()
            all_threads.append(t)
            print(f"Waiting on players to join ({len(all_threads)}/2)")

    except KeyboardInterrupt:
        print("Stopped by Ctrl+C")
    finally:
        if s:
            s.close()
        for t in all_threads:
            t.join()

def handle_player(conn, addr):
    message = conn.recv(1024)
    player_name = message.decode()

    while len(all_threads) != 2:
        sleep(1)
        
    conn.send("START".encode())

    pick = conn.recv(1024)
    players_picks.append([player_name, pick.decode()])
    
    while len(players_picks) != 2:
        sleep(1)

    opponent_data = None
    data1, data2 = players_picks
    if data1[0] != player_name:
        opponent_data = data1
    else:
        opponent_data = data2

    print(f"{opponent_data[0]} picked {opponent_data[1]}".encode())
    conn.send(f"{opponent_data[0]} picked {opponent_data[1]}".encode())

    sleep(1) # prevents one buffer writting to the other

    result = generate_result()
    conn.send(result.encode())

    conn.close()


def generate_result():
    player1_pick = players_picks[0][1]
    player2_pick = players_picks[1][1]

    if player1_pick == "rock"     and player2_pick == "scissors" or \
    player1_pick    == "scissors" and player2_pick == "paper" or \
    player1_pick    == "paper"    and player2_pick == "rock":
        return players_picks[0][0]
    
    if player2_pick == "rock"     and player1_pick == "scissors" or \
    player2_pick    == "scissors" and player1_pick == "paper" or \
    player2_pick    == "paper"    and player1_pick == "rock":
        return players_picks[1][0]

    return "draw"




if __name__ == "__main__":
    main()