const canvas = document.querySelector('.canvas');
const dimensionSelect = document.querySelector('select');
const clearButton = document.querySelector('.btn-clear');
let isMouseDown = false;

canvas.addEventListener('mousedown', e => {
    e.preventDefault(); //prevent dragging
    enableMouseDown();
});
canvas.addEventListener('mouseup', disableMouseDown);
dimensionSelect.addEventListener('change', changeCanvasSize);
clearButton.addEventListener('click', clearCanvas);

createCanvas(16);
addDrawingCapability();


function enableMouseDown() {
    isMouseDown = true;
}

function disableMouseDown() {
    isMouseDown = false;
}

function createCanvas(dimension) {
    for(let i = 0; i < dimension; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        canvas.appendChild(row);
        for(let i = 0; i < dimension; i++) {
            const tile = document.createElement('div'); 
            tile.classList.add('tile', 'border');
            row.appendChild(tile);
        }
    }
}

function deleteCanvas() {
    const canvasRows = document.querySelectorAll('.row');
    canvasRows.forEach(row => {
        row.remove();
    });
}

function addDrawingCapability() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('mouseover', e => {
            if(isMouseDown) {
                tile.style.cssText = 'background-color: red;'
            }
        })
        tile.addEventListener('click', e => {
            tile.style.cssText = 'background-color: red;'
        })
    })
}

function clearCanvas() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.style.cssText = 'background-color: #fff;');
}

function changeCanvasSize(e) {
    deleteCanvas();
    createCanvas(e.target.value);
    addDrawingCapability();
}