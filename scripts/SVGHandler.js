let pieceIds = Array(64).fill("-");

let prev_to = -1;
let prev_from = -1;

const setPrevFromTo = (from, to) => {

    if(from != -1)
    {
        let x = Math.floor(from % 8);
        let y = 7 - Math.floor(from / 8);
        let square_from = document.getElementById("sq(" + x + "," + y + ")");
        square_from.setAttribute("fill", (x + y) % 2 == 0 ? "#F7F3AA" : "#83834C");
    }
    
    if(to != -1)
    {
        let x = Math.floor(to % 8);
        let y = 7 - Math.floor(to / 8);
        let square_to = document.getElementById("sq(" + x + "," + y + ")");
        square_to.setAttribute("fill", (x + y) % 2 == 0 ? "#F7F3AA" : "#83834C");
    }

    if (prev_from != -1 && from != prev_from) {
        let x = Math.floor(prev_from % 8);
        let y = 7 - Math.floor(prev_from / 8);
        let prev_from_square = document.getElementById("sq(" + x + "," + y + ")");
        prev_from_square.setAttribute("fill", (x + y) % 2 == 0 ? "#F7F3E3" : "#43434C");
    }
    
    if (prev_to != -1 && to != prev_to) {
        let x = Math.floor(prev_to % 8);
        let y = 7 - Math.floor(prev_to / 8);
        let prev_to_square = document.getElementById("sq(" + x + "," + y + ")");
        prev_to_square.setAttribute("fill", (x + y) % 2 == 0 ? "#F7F3E3" : "#43434C");
    }

    prev_from = from;
    prev_to = to;
}

const setupSVGBoard = (board) => {
    const svgBoard = document.getElementById("board");
    // Add all board squares
    for (let i = 0; i < 64; i++) {
        let square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        let x = Math.floor(i % 8);
        let y = Math.floor(i / 8);
        square.setAttribute("x", x * 10);
        square.setAttribute("y", y * 10);
        square.setAttribute("id", "sq(" + x + "," + y + ")");
        square.setAttribute("width", "10");
        square.setAttribute("height", "10");
        square.setAttribute("fill", (x + y) % 2 == 0 ? "#F7F3E3" : "#43434C");
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

    setupPieces(board);
}

let marked;
// This marks the svg elements for removal, such that their ids can be reused, bit the elements can still be drawn
const markPiecesForRemove = () => {
    marked = [];
    const svgBoard = document.getElementById("board");
    for (let i = 0; i < 64; i++) {
        if (pieceIds[i] == "-") continue;
        marked.push(svgBoard.getElementById(pieceIds[i]))
    }
    pieceIds = Array(64).fill("-");
}

const removePieces = () => {
    const svgBoard = document.getElementById("board");
    marked.forEach(element => {
        svgBoard.removeChild(element);
    });
}

const setupPieces = (board) => {
    const svgBoard = document.getElementById("board");
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

        let path = "./sprites/" + spriteType + (color == 8 ? "1" : "") + ".png";
        let rank = Math.floor(i / 8);
        let file = i % 8;
        addPieceElement(path, rank, file, svgBoard, "id_" + i);
        pieceIds[i] = "id_" + i;
    }
}

const addPieceElement = (src, rank, file, svgBoard, id) => {
    let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", src);
    image.setAttribute("x", file * 10 + 1);
    image.setAttribute("y", (-rank + 7) * 10 + 1);
    image.setAttribute("width", "10%");
    image.setAttribute("height", "10%");
    image.setAttribute("id", id);
    image.setAttribute("class", "piece");
    svgBoard.appendChild(image);
}