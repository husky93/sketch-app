const canvas = document.querySelector('.canvas');
const dimensionSelect = document.querySelector('select');
const clearButton = document.querySelector('.btn-clear');
const toggleGridButton = document.querySelector('.btn-grid');
const penColorPicker = document.querySelector('.pencolor');
const bgColorPicker = document.querySelector('.bgcolor');
let isMouseDown = false;
let penColor = penColorPicker.value;
let bgColor = bgColorPicker.value;

canvas.addEventListener('mousedown', e => {
    e.preventDefault(); //prevent dragging
    if(e.button === 0) enableMouseDown();
});
canvas.addEventListener('mouseup', disableMouseDown);
dimensionSelect.addEventListener('change', changeCanvasSize);
clearButton.addEventListener('click', clearCanvas);
toggleGridButton.addEventListener('click', toggleGrid);
penColorPicker.addEventListener('change', changePenColor);
bgColorPicker.addEventListener('change', changeBackgroundColor);

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
            tile.style.cssText = `background-color: ${bgColor};`
            row.appendChild(tile);
        }
    }
}

function addDrawingCapability() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('mouseover', e => {
            if(isMouseDown) {
                tile.style.cssText = `background-color: ${penColor};`
                tile.classList.add('inked');
            }
        })
        tile.addEventListener('click', e => {
            tile.style.cssText = `background-color: ${penColor};`
            tile.classList.add('inked');
        })
    })
}

function deleteCanvas() {
    const canvasRows = document.querySelectorAll('.row');
    canvasRows.forEach(row => {
        row.remove();
    });
}

function changeCanvasSize(e) {
    deleteCanvas();
    createCanvas(e.target.value);
    addDrawingCapability();
}

function clearCanvas() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.style.cssText = `background-color: ${bgColor}`
        if(tile.classList.contains('inked')) {
            tile.classList.remove('inked');
        }
    });
}

function toggleGrid() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.classList.toggle('border'));
}

function changePenColor(e) {
    penColor = e.target.value;
}

function changeBackgroundColor(e) {
    const tiles = document.querySelectorAll('.tile');
    bgColor = e.target.value;
    tiles.forEach(tile => {
        if(!tile.classList.contains('inked')) tile.style.cssText = `background-color: ${bgColor};`
        else return;
    });
}