document.addEventListener("DOMContentLoaded", () => {
    // This function uses Bresenham's line algorithm to draw a line between 2 points.
    // Source: https://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript.
    function draw(currentPixel, previousPixel) {
        if (previousPixel === undefined) {
            document.getElementById(currentPixel).style = "background-color: black;";
            return;
        }
        
        let xy0 = previousPixel.split(",").map((str) => {
            return parseInt(str);
        });
        let xy1 = currentPixel.split(",").map((str) => {
            return parseInt(str);
        });
        
        let x1 = xy1[0], y1 = xy1[1], x0 = xy0[0], y0 = xy0[1];

        let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        let dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;

        let err = (dx > dy ? dx : -dy) / 2;

        while (true) {
            document.getElementById(`${x0},${y0}`).style = "background-color: black;";

            if (x0 === x1 && y0 === y1) break;

            let e2 = err;

            if (e2 > -dx) { err -= dy; x0 += sx; }
            if (e2 < dy) { err += dx; y0 += sy; }
        }
    }

    let penSize = 128;

    document.querySelector(".grid-container").style = `grid-template-columns: repeat(${penSize}, 1fr);`;

    for (let y = 0; y < penSize; y++) {
        for (let x = 0; x < penSize; x++) {
            let div = document.createElement("div");
            div.className = "grid-item";
            div.id = `${x},${y}`;
            div.addEventListener("dragstart", (event) => event.preventDefault());
            document.querySelector(".grid-container").appendChild(div);
        }
    }
    
    const gridItems = document.querySelectorAll(".grid-item");

    let previousPixel;
    let currentPixel;

    document.querySelector(".grid-container").addEventListener("mouseleave", () => previousPixel = undefined);

    let mouseDown;

    document.addEventListener("mousedown", () => mouseDown = true);
    document.addEventListener("mouseup", () => {
        mouseDown = false;
        previousPixel = undefined;
    });

    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mousedown", () => {
            currentPixel = gridItem.id;

            draw(currentPixel, previousPixel);

            previousPixel = currentPixel;
        }, {passive: true, capture: true});

        gridItem.addEventListener("mouseenter", () => {
            if (mouseDown) {
                currentPixel = gridItem.id;

                draw(currentPixel, previousPixel);
            
                previousPixel = currentPixel;
            }
        }, {passive: true, capture: true});
    });
});