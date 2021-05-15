const setupSVGBoard = () =>
{
    const svgBoard = document.getElementById("board");
    // Add all board squares
    for(let i = 0; i < 64; i++)
    {
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
        if(x == 0)
        {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x * 10 + 0.5);
            text.setAttribute("y", y * 10 + 2.25);
            text.setAttribute("class", "small");
            text.textContent = "" + (-y + 8);
            svgBoard.appendChild(text);
        }
        
        // Add file numbers
        if(y == 7)
        {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x * 10 + 7.5);
            text.setAttribute("y", y * 10 + 9);
            text.setAttribute("class", "small");
            text.textContent = String.fromCharCode(x + 65);
            svgBoard.appendChild(text);
        }
    }

    for(let file = 0; file < 8; file++)
    {
        addPieceElement("./sprites/pawn.png", file, 6, svgBoard);
        addPieceElement("./sprites/pawn1.png", file, 1, svgBoard);
    }

    addPieceElement("./sprites/rook1.png", 0, 0, svgBoard);
    addPieceElement("./sprites/knight1.png", 1, 0, svgBoard);
    addPieceElement("./sprites/bishop1.png", 2, 0, svgBoard);
    addPieceElement("./sprites/queen1.png", 3, 0, svgBoard);
    addPieceElement("./sprites/king1.png", 4, 0, svgBoard);
    addPieceElement("./sprites/bishop1.png", 5, 0, svgBoard);
    addPieceElement("./sprites/knight1.png", 6, 0, svgBoard);
    addPieceElement("./sprites/rook1.png", 7, 0, svgBoard);
    
    addPieceElement("./sprites/rook.png", 0, 7, svgBoard);
    addPieceElement("./sprites/knight.png", 1, 7, svgBoard);
    addPieceElement("./sprites/bishop.png", 2, 7, svgBoard);
    addPieceElement("./sprites/queen.png", 3, 7, svgBoard);
    addPieceElement("./sprites/king.png", 4, 7, svgBoard);
    addPieceElement("./sprites/bishop.png", 5, 7, svgBoard);
    addPieceElement("./sprites/knight.png", 6, 7, svgBoard);
    addPieceElement("./sprites/rook.png", 7, 7, svgBoard);
}

const addPieceElement = (src, x, y, svgBoard) =>
{
    let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", src);
    image.setAttribute("x", x*10 + 1);
    image.setAttribute("y", y*10 + 1);
    image.setAttribute("width", "10%");
    image.setAttribute("height", "10%");
    svgBoard.appendChild(image);
}




window.addEventListener('load', (event) => setupSVGBoard());