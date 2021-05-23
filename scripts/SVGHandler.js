let api;
Module.onRuntimeInitialized = () => {
    api = {
        init: Module.cwrap('init', null, ['number']),
        isCheckmate: Module.cwrap('isBoardCheckmate', 'number', []),
        getBoardPointer: Module.cwrap('getCurrentBoardPointer', 'number', []),
        getBoardSize: Module.cwrap('getCurrentBoardSize', 'number', []),
        resetBoard: Module.cwrap('resetBoard', null, []),
    }

    onWASMLoaded();
};

function onWASMLoaded() {

    console.log("Init...");
    api.init(10);
    api.resetBoard();
    console.log("Init finished");
    
    document.getElementById("loader").setAttribute("hidden", "true");
    const boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
    let board = new Uint8Array(boardView);

    setupSVGBoard(board);
}

const setupSVGBoard = (board) => {
    const svgBoard = document.getElementById("board");
    // Add all board squares
    for (let i = 0; i < 64; i++) {
        let square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        let x = Math.floor(i / 8);
        let y = Math.floor(i % 8);
        square.setAttribute("x", x * 10);
        square.setAttribute("y", y * 10);
        square.setAttribute("width", "10");
        square.setAttribute("height", "10");
        square.setAttribute("fill", (x + y) % 2 == 0 ? "#F7F3E3 " : "#43434C");
        svgBoard.appendChild(square);

        // Add rank numbers
        if (x == 0) {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x * 10 + 0.5);
            text.setAttribute("y", y * 10 + 2.25);
            text.setAttribute("class", "small");
            text.textContent = "" + (-y + 8);
            svgBoard.appendChild(text);
        }

        // Add file numbers
        if (y == 7) {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x * 10 + 7.5);
            text.setAttribute("y", y * 10 + 9);
            text.setAttribute("class", "small");
            text.textContent = String.fromCharCode(x + 65);
            svgBoard.appendChild(text);
        }
    }

    for (let i = 0; i < 64; i++) {
        if (board[i] == 0) continue;

        // 16 is WHITE and 8 is BLACK
        let color = board[i] & 0b11000
        let type = board[i] & 0b00111
        let spriteType;

        switch (type) {
            case 0b001: // Pawn
                spriteType = "pawn";
                break;
            case 0b010: // Rook
                spriteType = "rook";
                break;
            case 0b011: // Knight
                spriteType = "knight";
                break;
            case 0b100: // Bishop
                spriteType = "bishop";
                break;
            case 0b101: // King
                spriteType = "king";
                break;
            case 0b110: // Queen
                spriteType = "queen";
                break;
        }

        let path = "./sprites/" + spriteType + (color == 8 ? "1": "") + ".png";
        let rank = Math.floor(i / 8);
        let file = i % 8;
        addPieceElement(path, rank, file, svgBoard);
    }
}

const addPieceElement = (src, rank, file, svgBoard) => {
    let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", src);
    image.setAttribute("x", file * 10 + 1);
    image.setAttribute("y", (-rank+7) * 10 + 1);
    image.setAttribute("width", "10%");
    image.setAttribute("height", "10%");
    svgBoard.appendChild(image);
}
