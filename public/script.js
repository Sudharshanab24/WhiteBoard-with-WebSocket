const canvas = document.getElementById("canvas");
canvas.width = 0.92 * window.innerWidth;  // Adjust for toolbar width
canvas.height = window.innerHeight;

var io = io.connect('https://whiteboard-with-websocket-2.onrender.com');
const ctx = canvas.getContext("2d");

let mouseDown = false;
let currentTool = "pen"; // Default tool
let currentColor = "black"; // Default color
let prevX, prevY;  // Variables to store previous coordinates

// Set initial line properties
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
    ctx.strokeStyle = currentColor;  // Use selected color for pen
    ctx.lineWidth = 5;  // Pen stroke width
    penButton.classList.add("active");
    eraserButton.classList.remove("active");
});

// Eraser Button Click
eraserButton.addEventListener("click", () => {
    currentTool = "eraser";
    ctx.strokeStyle = "white";  // White for erasing
    ctx.lineWidth = 20;  // Wider stroke for erasing
    eraserButton.classList.add("active");
    penButton.classList.remove("active");
});

// Color Selection Click
colorOptions.forEach(option => {
    option.addEventListener("click", (e) => {
        currentColor = e.target.getAttribute("data-color");

        if (currentTool === "pen") {
            ctx.strokeStyle = currentColor;  // Set selected color
        }

        // Update the color selection UI
        colorOptions.forEach(opt => opt.style.border = '2px solid white');
        e.target.style.border = '2px solid black';
    });
});

// Mouse Down Event
canvas.onmousedown = (e) => {
    mouseDown = true;
    prevX = e.clientX - canvas.offsetLeft;
    prevY = e.clientY - canvas.offsetTop;
    ctx.beginPath();  // Start a new drawing path
    ctx.moveTo(prevX, prevY);
};

// Mouse Up Event
canvas.onmouseup = () => {
    mouseDown = false;
};

// Mouse Move Event - Drawing
canvas.onmousemove = (e) => {
    if (!mouseDown) return;

    let currentX = e.clientX - canvas.offsetLeft;
    let currentY = e.clientY - canvas.offsetTop;

    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Emit the drawing data to the server
    io.emit('drawing', {
        prevX: prevX,
        prevY: prevY,
        currentX: currentX,
        currentY: currentY,
        color: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
        tool: currentTool
    });

    // Update previous coordinates
    prevX = currentX;
    prevY = currentY;
};

// Listen for drawing events from server
io.on('drawing', (data) => {
    ctx.beginPath();
    ctx.moveTo(data.prevX, data.prevY);

    // Set the received drawing properties
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.lineWidth;

    if (data.tool === "eraser") {
        ctx.strokeStyle = "white";  // Eraser uses white color
    }

    ctx.lineTo(data.currentX, data.currentY);
    ctx.stroke();
});
