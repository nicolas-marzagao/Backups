#include <iostream>
#include <string>

std::string board[8][8];

void setupBoard() {
    // Powns
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            // black pieces
            if (i == 1) board[1][j] = "bP";
            // white pieces
            if (i == 6) board[6][j] = "wP";
        }
    }

    board[0][0] = "bR";
    board[0][7] = "bR";

    board[7][0] = "wR";
    board[7][7] = "wR";
}


int main() {
    setupBoard();

    std::cout << "   A.  B.  C.  D.  E.  F.  G.  H." << std::endl;
    for (int i = 0; i < 8; i++) {
        std::cout << 8 - i << " ";
        for (int j = 0; j < 8; j++) {
            std::cout << " " << board[i][j] << " ";
        }
        std::cout << std::endl;
    }

    return 0;
}