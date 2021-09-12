// Get the modal
var setting_modal = document.getElementById("settings-modal");

// Get the button that opens the modal
var btn = document.getElementById("settings-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
	setting_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	setting_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == setting_modal) {
		setting_modal.style.display = "none";
	}
}

document.getElementById("reset-btn").onclick = (e) => {
	api.resetBoard();
	markPiecesForRemove();
	setPrevFromTo(-1, -1);

	const boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
    let board = new Uint8Array(boardView);
	setupPieces(board);
	removePieces();

	let radios = document.getElementsByName('color_select');
	// Play as white
	if(radios[0].checked)
	{
		// Do nothing
	}
	// play as black
	else if(radios[1].checked)
	{
		performAITurn();
	}

	setting_modal.style.display = "none";
}

document.getElementById("reset-btn2").onclick = (e) => {
	api.resetBoard();
	markPiecesForRemove();
	setPrevFromTo(-1, -1);

	const boardView = new Uint8Array(Module.HEAP8.buffer, api.getBoardPointer(), 64);
    let board = new Uint8Array(boardView);
	setupPieces(board);
	removePieces();

	var termination_modal = document.getElementById("termination-modal");
    termination_modal.style.display = "none";
}

document.getElementById("view-board-btn").onclick = (e) => {
	var termination_modal = document.getElementById("termination-modal");
	termination_modal.style.display = "none";
}
