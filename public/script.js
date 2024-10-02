const canvas = document.getElementById("canvas");

canvas.width = 0.92 * window.innerWidth;  // Adjust for toolbar width
canvas.height = window.innerHeight;

// var io=io.connect('http://localhost:8000')

const ctx = canvas.getContext("2d");

let mouseDown = false;
let currentTool = "pen"; // Default to pen
let currentColor = "black"; // Default pen color
let x, y;

// Set initial line properties for drawing
ctx.lineWidth = 5;
ctx.lineCap = "round";  // Smooth line edges
ctx.strokeStyle = currentColor;  // Default color

// Tool Buttons
const penButton = document.getElementById("pen");
const eraserButton = document.getElementById("eraser");

// Color Picker
const colorOptions = document.querySelectorAll(".color-option");

// Pen Button Click
penButton.addEventListener("click", () => {
    currentTool = "pen";
    ctx.strokeStyle = currentColor;  // Set to current color
    ctx.lineWidth = 5;  // Pen stroke width
    penButton.classList.add("active");
    eraserButton.classList.remove("active");
});

// Eraser Button Click
eraserButton.addEventListener("click", () => {
    currentTool = "eraser";
    ctx.strokeStyle = "white";  // White color for erasing
    ctx.lineWidth = 20;  // Wider stroke for erasing
    eraserButton.classList.add("active");
    penButton.classList.remove("active");
});

// Color Selection Click
colorOptions.forEach(option => {
    option.addEventListener("click", (e) => {
        currentColor = e.target.getAttribute("data-color");

        if (currentTool === "pen") {
            ctx.strokeStyle = currentColor;  // Set selected color if in pen mode
        }

        // Remove active class from other colors
        colorOptions.forEach(opt => opt.style.border = '2px solid white');
        // Add active class to the clicked color
        e.target.style.border = '2px solid black';
    });
});

// Mouse down event
canvas.onmousedown = (e) => {
    mouseDown = true;
    ctx.beginPath();
    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;
    ctx.moveTo(x, y);
}

// Mouse up event
canvas.onmouseup = () => {
    mouseDown = false;
}

// Mouse move event
canvas.onmousemove = (e) => {
    if (!mouseDown) return;

    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;

    if (currentTool === "pen" || currentTool === "eraser") {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}
