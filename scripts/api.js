Module.onRuntimeInitialized = () => {
    api = {
        init: Module.cwrap('init', null, ['number']),
        isCheckmate: Module.cwrap('isBoardCheckmate', 'number', []),
        getBoardPointer: Module.cwrap('getCurrentBoardPointer', 'number', []),
        getBoardSize: Module.cwrap('getCurrentBoardSize', 'number', []),
        resetBoard: Module.cwrap('resetBoard', null, []),
        performMove: Module.cwrap('performMatchingMove', 'number', ['number', 'number', 'number']),
        performAIMove: Module.cwrap('playAIMove', null, ['number']),
        getTurn: Module.cwrap('getTurn', null, []),
    }

    onWASMLoaded();
};
