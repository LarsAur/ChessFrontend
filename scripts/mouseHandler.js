let board = document.getElementById("board");
let dragging = false;
let currentPiece = null;
let from_file, from_rank;
let to_file, to_rank;

function onWASMLoaded() {
    console.log("Init...");
    api.init(16);
    api.resetBoard();
    console.log("Init finished");

    document.getElementById("loader").style.visibility = "hidden";
    const boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
    let board = new Uint8Array(boardView);

    setupSVGBoard(board);
}

const onMouseDown = (e) => {

    let radios = document.getElementsByName('color_select');
	let play_as = 0;
    // Play as white
	if(radios[0].checked)
	{
		play_as = 32;
	}
	// play as black
	else if(radios[1].checked)
	{
        play_as = 16;
	}

    if (api.getTurn() == play_as) return;   // If it is not whites turn, do nothing

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

        if (accept == 1) {
            setPrevFromTo(from, to);
            let boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
            let board = new Uint8Array(boardView);
            var audio = new Audio('./audio/Move.wav');
            audio.play();
            markPiecesForRemove();
            setupPieces(board);
            removePieces();


            if (api.isCheckmate() != 0) {
                onTermination();
                return;
            }

            document.getElementById("processing-container").style.visibility = "visible";
            setTimeout(performAITurn, 100);
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

        document.getElementById("processing-container").style.visibility = "visible";
        setTimeout(performAITurn, 100);
    }
    else {
        currentPiece.setAttribute("x", from_file * 10 + 1);
        currentPiece.setAttribute("y", (-from_rank + 7) * 10 + 1);
    }

    currentPiece = null;
}

const performAITurn = () => {

    var select = document.getElementById('depth-selector');
    var depth = select.options[select.selectedIndex].value;

    api.performAIMove(depth);

    document.getElementById("processing-container").style.visibility = "hidden";
    setPrevFromTo(api.getPrevAIMoveFrom(), api.getPrevAIMoveTo());
    let boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
    let board = new Uint8Array(boardView);
    var audio = new Audio('./audio/Move.wav');
    audio.play();
    markPiecesForRemove();
    setupPieces(board);
    removePieces();

    if (api.isCheckmate() != 0) {
        onTermination();
        return;
    }
}

const onTermination = () => {
    var box = document.getElementById("termination-msg");
    if (api.isCheckmate() == 1) {
        box.innerHTML = "Stalemate";
    }

    if (api.isCheckmate() == 16) {
        box.innerHTML = "White wins";

    }

    if (api.isCheckmate() == 8) {
        box.innerHTML = "Black wins";
    }

    var termination_modal = document.getElementById("termination-modal");
    termination_modal.style.display = "block";
    let audio = new Audio("./audio/Victory.wav");
    audio.play();
}

document.getElementById("promQ").onclick = (e) => promoteToType(6);
document.getElementById("promR").onclick = (e) => promoteToType(2);
document.getElementById("promB").onclick = (e) => promoteToType(4);
document.getElementById("promK").onclick = (e) => promoteToType(3);
