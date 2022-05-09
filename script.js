const canvas = document.querySelector('.canvas');
let isMouseDown = false;
canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    enableMouseDown();
});
canvas.addEventListener('mouseup', disableMouseDown);

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
            tile.classList.add('tile');
            row.appendChild(tile);
        }
    }
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