document.addEventListener("DOMContentLoaded", () => {
    let penSize = 4;

    document.querySelector(".grid-container").style = `grid-template-columns: repeat(${penSize}, auto);`;

    for (let i = 0; i < penSize ** 2; i++) {
        let div = document.createElement("div");
        div.className = "grid-item";
        document.querySelector(".grid-container").appendChild(div);
    }
    
    const gridItems = document.querySelectorAll(".grid-item");

    let mouseDown;
    document.addEventListener("mousedown", () => mouseDown = true);
    document.addEventListener("mouseup", () => mouseDown = false);

    gridItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            if (mouseDown) {
                item.style = "background-color: black;";
            }
        });
    });
});
