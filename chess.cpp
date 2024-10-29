#include <iostream>
#include <string>

typedef struct Coordinates {
    int col;
    int row;
} Coordinates;

std::string board[8][8];

void setupBoard() {
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            board[i][j] = "::";
        }
    }

    // Powns
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            // black pieces
            if (i == 1) board[1][j] = "bP";
            // white pieces
            if (i == 6) board[6][j] = "wP";
        }
    }

    board[0][0] = "bR"; board[0][7] = "bR"; // Rooks
    board[0][1] = "bN"; board[0][6] = "bN"; // Knights
    board[0][2] = "bB"; board[0][5] = "bB"; // Bishops
    board[0][3] = "bQ"; board[0][4] = "bK"; // Queen & King


    board[7][0] = "wR"; board[7][7] = "wR";
    board[7][1] = "wN"; board[7][6] = "wN";
    board[7][2] = "wB"; board[7][5] = "wB";
    board[7][4] = "wK"; board[7][3] = "wQ";
}

void printBoard() {
    std::cout << "::  A.  B.  C.  D.  E.  F.  G.  H." << std::endl;
    for (int i = 0; i < 8; i++) {
        std::cout << 8 - i << ". ";
        for (int j = 0; j < 8; j++) {
            std::cout << " " << board[i][j] << " ";
        }
        std::cout << std::endl;
    }
}

Coordinates getlocation(std::string boardLocation) {
    Coordinates c;

    c.col = boardLocation[0] - 'a';
    c.row = 8 - (boardLocation[1] - '0');

    return c;
}

void movePiece(std::string startingLocation, std::string destination) {
    // transform codes into locations
    Coordinates s = getlocation(startingLocation);
    Coordinates d = getlocation(destination);

    // get piece and move it
    std::string piece = board[s.row][s.col];

    board[s.row][s.col] = "::";
    board[d.row][d.col] = piece;
}


int main() {
    std::string pieceLocation;
    std::string pieceDestination;

    setupBoard();

    while (true) {
        printBoard();
        std::cout << "Piece Location: ";
        std::cin >> pieceLocation;
        std::cout << "Piece Destination: ";
        std::cin >> pieceDestination;

        movePiece(pieceLocation, pieceDestination);
        system("clear");
    }

    return 0;
}
