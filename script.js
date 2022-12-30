// This function uses Bresenham's line algorithm to draw a line between 2 points.
// Source: https://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript.
function drawLine(currentPixel, previousPixel, color) {
    if (previousPixel === undefined) {
        document.getElementById(currentPixel).style.backgroundColor = color;
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
        document.getElementById(`${x0},${y0}`).style.backgroundColor = color;

        if (x0 === x1 && y0 === y1) break;

        let e2 = err;

        if (e2 > -dx) { err -= dy; x0 += sx; }
        if (e2 < dy) { err += dx; y0 += sy; }
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// color = 0 (default), rainbow = 1, eraser = 2.
let mode = 0;

let previousPixel;
let currentPixel;

let mouseDown;

document.addEventListener("mousedown", (event) => {
    // Only allowing left clicks.
    if (event.button !== 0) return;

    mouseDown = true;
});

document.addEventListener("mouseup", (event) => {
    // Only allowing left clicks.
    if (event.button !== 0) return;

    mouseDown = false;
    // Resetting previousPixel.
    previousPixel = undefined;
});

document.addEventListener("DOMContentLoaded", () => {
    const buttons = [
        document.getElementById("color"),
        document.getElementById("rainbow"),
        document.getElementById("eraser")
    ];

    function resetButtonsColor() {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundColor = "#4a4e69";  
        }
    }

    // Adding event listeners for the buttons. 
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", (event) => {
            // Switching mode.
            mode = i;
    
            // Changing colors.
            resetButtonsColor();
    
            // Changing color of clicked button.
            event.target.style.backgroundColor = "#22223b";
        });
    }

    // Getting the selected color from colorPicker.
    let color = document.getElementById("colorPicker").value;

    // Changing color when user selects another color from coloPicker.
    document.getElementById("colorPicker").addEventListener("input", event => color = event.target.value);

    function draw(event, currentPixel) {
        // Only allowing left clicks.
        if (event.button !== 0) return;

        switch (mode) {
            // Color mode.
            case 0:
                drawLine(currentPixel, previousPixel, color);
                break;

            // Rainbow mode.
            case 1:
                drawLine(currentPixel, previousPixel, `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`);
                break;
            // Eraser mode.
            case 2:
                drawLine(currentPixel, previousPixel, "white");
                break;
                
            default:
                break;
        }
    
        previousPixel = currentPixel;
    }

    // Generates a grid inside the gridContainer.
    function initiateGrid(gridContainer, gridDensity) {
        // Specifying the number of columns in grid-container.
        gridContainer.style.gridTemplateColumns = `repeat(${gridDensity}, auto)`;

        // Adding div's to grid-container according to gridDensity. 
        for (let y = 0; y < gridDensity; y++) {
            for (let x = 0; x < gridDensity; x++) {
                let div = document.createElement("div");

                div.className = "grid-item";

                // Giving the div an X and Y position.
                div.id = `${x},${y}`;

                // Preventing the the div from dragging.
                div.addEventListener("dragstart", (event) => event.preventDefault());

                // Drawing when user clicks or drags the mouse.
                div.addEventListener("mousedown", (event) => {
                    draw(event, div.id);
                }, {passive: true, capture: true});
                div.addEventListener("mouseover", (event) => {
                    if (mouseDown) {
                        draw(event, div.id);
                    }
                }, {passive: true, capture: true});

                gridContainer.appendChild(div);
            }
        }

        const gridItems = document.querySelectorAll(".grid-item");
    
        // Adding event listener for the clear button.
        document.getElementById("clear").addEventListener("click", () => {
            // Clearing the sketch pad (grid-container).
            gridItems.forEach(gridItem => {
                gridItem.style.backgroundColor = "white";
            });
        });    
    }

    const gridContainer = document.querySelector(".grid-container");

    // Resetting previousPixel when mouse leaves the sketch pad (grid-container).
    gridContainer.addEventListener("mouseleave", () => previousPixel = undefined);

    const sliderValueDisplay = document.querySelector(".slider-value");
    const slider = document.getElementById("slider");

    // Getting the selected gridDensity from slider.
    let gridDensity = parseInt(slider.value);

    // Displaying currently selected gridDensity.
    sliderValueDisplay.textContent = `${gridDensity} X ${gridDensity}`;

    // Changing gridDensity value when user moves the slider.
    slider.addEventListener("input", (event) => { 
        // Getting new gridDensity value.
        gridDensity = parseInt(event.target.value);

        // Displaying new gridDensity value.
        sliderValueDisplay.textContent = `${gridDensity} X ${gridDensity}`;
    });

    initiateGrid(gridContainer, gridDensity);

    // Generating a new grid when the user moves the slide.
    slider.addEventListener("change", () => {
        removeAllChildNodes(gridContainer);

        // Generating a new grid.
        initiateGrid(gridContainer, gridDensity);
    });

    // Copyright and current year.
    document.querySelector(".copyright").innerHTML = `Copyright &#169; TITANIUM339 ${new Date().getFullYear()}`;
});