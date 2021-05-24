let board = document.getElementById("board");
let dragging = false;
let currentPiece = null;
let from_file, from_rank;
let to_file, to_rank;

const depth = 4;

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

const onMouseDown = (e) => {
    if (api.getTurn() != 16) return;   // If it is not whites turn, do nothing

    let boardSize = board.clientWidth;

    let rank = -Math.floor(e.offsetY * 8 / boardSize) + 7;
    let file = Math.floor(e.offsetX * 8 / boardSize);

    from_file = file;
    from_rank = rank;

    let id = pieceIds[rank * 8 + file];
    if (id != "-") {
        currentPiece = board.getElementById(id);
        dragging = true;
    }
}

const onMouseUp = (e) => {
    if (dragging) {
        dragging = false;
        let boardSize = board.clientWidth;

        to_rank = -Math.floor(e.offsetY * 8 / boardSize) + 7;
        to_file = Math.floor(e.offsetX * 8 / boardSize);

        let from = from_rank * 8 + from_file;
        let to = to_rank * 8 + to_file;

        const boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
        let boardArr = new Uint8Array(boardView);

        // If pawn is moved to promotion rank
        if ((boardArr[from_rank * 8 + from_file] & 0b111) == 0b001 && to_rank == 7) {
            document.getElementById("promotion-select").style.visibility = "visible";
            return;
        }

        let accept = api.performMove(from, to, 0);
        console.log(accept)

        if (accept == 1) {
            let boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
            let board = new Uint8Array(boardView);
            markPiecesForRemove();
            setupPieces(board);
            removePieces();

            if (api.isCheckmate() != 0) {
                onTermination();
                return;
            }

            api.performAIMove(depth);
            boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
            board = new Uint8Array(boardView);
            markPiecesForRemove();
            setupPieces(board);
            removePieces();

            if (api.isCheckmate() != 0) {
                onTermination();
                return;
            }
        }
        else {
            currentPiece.setAttribute("x", from_file * 10 + 1);
            currentPiece.setAttribute("y", (-from_rank + 7) * 10 + 1);
        }

        currentPiece = null;
    }
}

const onMouseMove = (e) => {
    let boardSize = board.clientWidth;
    if (dragging) {
        currentPiece.setAttribute("x", Number(currentPiece.getAttribute("x"), 10) + (e.movementX * 80 / boardSize));
        currentPiece.setAttribute("y", Number(currentPiece.getAttribute("y"), 10) + (e.movementY * 80 / boardSize));
    }
}

board.onmousedown = onMouseDown;
board.onmouseup = onMouseUp
board.onmousemove = onMouseMove;

const promoteToType = (type) => {
    document.getElementById("promotion-select").style.visibility = "hidden";
    let from = from_rank * 8 + from_file;
    let to = to_rank * 8 + to_file;
    let accept = api.performMove(from, to, type);

    if (accept == 1) {
        let boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
        let board = new Uint8Array(boardView);
        markPiecesForRemove();
        setupPieces(board);
        removePieces();

        if (api.isCheckmate() != 0) {
            onTermination();
            return;
        }

        api.performAIMove(depth);
        boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
        board = new Uint8Array(boardView);
        markPiecesForRemove();
        setupPieces(board);
        removePieces();

        if (api.isCheckmate() != 0) {
            onTermination();
            return;
        }
    }
    else {
        currentPiece.setAttribute("x", from_file * 10 + 1);
        currentPiece.setAttribute("y", (-from_rank + 7) * 10 + 1);
    }

    currentPiece = null;
}

const onTermination = () => {
    box = document.getElementById("message-box");
    box.style.visibility = "visible";
    
    if(api.isCheckmate() == 1)
    {
        box.innerHTML = "Stalemate";
    }
    
    if(api.isCheckmate() == 16)
    {
        box.innerHTML = "White wins";
        
    }
    
    if(api.isCheckmate() == 8)
    {
        box.innerHTML = "Black wins";
    }
}

document.getElementById("promQ").onclick = (e) => promoteToType(6);
document.getElementById("promR").onclick = (e) => promoteToType(2);
document.getElementById("promB").onclick = (e) => promoteToType(4);
document.getElementById("promK").onclick = (e) => promoteToType(3);