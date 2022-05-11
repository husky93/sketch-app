const canvas = document.querySelector('.canvas');
const dimensionSelect = document.querySelector('select');
const toggleGridButton = document.querySelector('.btn-grid');
const toggleEraserButton = document.querySelector('.btn-eraser');
const toggleRainbowButton = document.querySelector('.btn-rainbow');
const grabColorButton = document.querySelector('.btn-color');
const clearButton = document.querySelector('.btn-clear');
const loadFileInput = document.querySelector('.btn-load');
const saveFileButton = document.querySelector('.btn-save');
const penColorPicker = document.querySelector('.pencolor');
const bgColorPicker = document.querySelector('.bgcolor');
const warningText = document.querySelector('.warning');
const fileWarningText = document.querySelector('.filewarning');
const imageBuffer = document.querySelector('canvas');

let isMouseDown = false;
let eraserMode = false;
let rainbowMode = false;
let penColor = penColorPicker.value;
let bgColor = bgColorPicker.value;
let eraserColor = bgColorPicker.value;
const reader = new FileReader();

canvas.addEventListener('mousedown', e => {
    e.preventDefault(); //prevent dragging
    if(e.button === 0) enableMouseDown();
});
canvas.addEventListener('mouseup', disableMouseDown);
dimensionSelect.addEventListener('change', changeCanvasSize);
toggleGridButton.addEventListener('click', toggleGrid);
toggleEraserButton.addEventListener('click', toggleEraser);
toggleRainbowButton.addEventListener('click', toggleRainbow);
grabColorButton.addEventListener('click', grabColor);
clearButton.addEventListener('click', clearCanvas);
penColorPicker.addEventListener('change', changePenColor);
bgColorPicker.addEventListener('change', changeBackgroundColor);
loadFileInput.addEventListener('change', loadFile);
saveFileButton.addEventListener('click', saveImage)


createCanvas(16);
addDrawingCapability();



//////////////////////////////////////////////////////////////////////////////////////////////

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
        tile.addEventListener('mouseover', changeColorMO)
        tile.addEventListener('click', changeColorClick)
    });
}

function removeDrawingCapability() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.removeEventListener('mouseover', changeColorMO)
        tile.removeEventListener('click', changeColorClick)
    })
}

function changeColorMO(e) {
    if(isMouseDown && !rainbowMode) {
        e.target.style.cssText = `background-color: ${penColor};`
        eraserMode ? e.target.classList.remove('inked') : e.target.classList.add('inked');
    } else if (isMouseDown && rainbowMode) {
        const col = getRandomColor();
        e.target.style.cssText = `background-color: ${col};`
        eraserMode ? e.target.classList.remove('inked') : e.target.classList.add('inked');
    }

}


function changeColorClick(e) {
    if(!rainbowMode) {
        e.target.style.cssText = `background-color: ${penColor};`
        eraserMode ? e.target.classList.remove('inked') : e.target.classList.add('inked');
    } else if (rainbowMode) {
        const col = getRandomColor();
        e.target.style.cssText = `background-color: ${col};`
        eraserMode ? e.target.classList.remove('inked') : e.target.classList.add('inked');
    }
}

function changeCanvasSize() {
    deleteCanvas();
    createCanvas(dimensionSelect.value);
    addDrawingCapability();
    imageBuffer.width = dimensionSelect.value;
    imageBuffer.height = dimensionSelect.value;
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

function toggleEraser() {
    let temp = '';
    if(rainbowMode) {
        toggleRainbow();
    }
    if(!grabColorButton.classList.contains('active')) {
        toggleEraserButton.classList.toggle('active');
        temp = eraserColor;
        eraserColor = penColor;
        penColor = temp;
        eraserMode = !eraserMode;
    } else {
        warningText.textContent = 'Choose a color before toggling eraser!';
    }
}

function toggleRainbow() {
    if(eraserMode) {
        toggleEraser();
    }
    if(grabColorButton.classList.contains('active')) {
        warningText.textContent = 'Choose a color before toggling rainbow mode!';
        return;
    }
    if(!toggleRainbowButton.classList.contains('active')) {
        toggleRainbowButton.classList.toggle('active');
        rainbowMode = true;
    } else {
        toggleRainbowButton.classList.toggle('active');
        rainbowMode = false;
    }
}

function changePenColor(e) {
    eraserMode ? eraserColor = e.target.value : penColor = e.target.value;
}

function changeBackgroundColor(e) {
    if(eraserMode) {
        toggleEraser();
    }
    const tiles = document.querySelectorAll('.tile');
    bgColor = e.target.value;
    eraserColor = e.target.value;
    tiles.forEach(tile => {
        if(!tile.classList.contains('inked')) tile.style.cssText = `background-color: ${bgColor};`
        else return;
    });
}

function grabColor(e) {
    if(eraserMode) {
        toggleEraser();
    }
    if(rainbowMode) {
        toggleRainbow();
    }
    const tiles = document.querySelectorAll('.tile');
    if(e.target.classList.contains('active')) {
        tiles.forEach(tile => {
            tile.removeEventListener('click', getTileColor)
        });
        addDrawingCapability();
        e.target.classList.toggle('active');
        warningText.textContent = '';
    }
    else {
        removeDrawingCapability();
        e.target.classList.toggle('active');
        tiles.forEach(tile => {
            tile.addEventListener('click', getTileColor)
        });
    }
}

function enableMouseDown() {
    isMouseDown = true;
}

function disableMouseDown() {
    isMouseDown = false;
}

function deleteCanvas() {
    const canvasRows = document.querySelectorAll('.row');
    canvasRows.forEach(row => {
        row.remove();
    });
}

function rgbToHex(col)
{
    if(col.charAt(0)=='r')
    {
        col=col.replace('rgb(','').replace(')','').split(',');
        let r=parseInt(col[0], 10).toString(16);
        let g=parseInt(col[1], 10).toString(16);
        let b=parseInt(col[2], 10).toString(16);
        r=r.length==1?'0'+r:r; g=g.length==1?'0'+g:g; b=b.length==1?'0'+b:b;
        let colHex='#'+r+g+b;
        return colHex;
    }
}

function getTileColor(e) {
    const tiles = document.querySelectorAll('.tile');
    penColorPicker.value = rgbToHex(e.target.style.backgroundColor);
    penColor = rgbToHex(e.target.style.backgroundColor);
    grabColorButton.classList.toggle('active'); 
    tiles.forEach(tile => {
        tile.removeEventListener('click', getTileColor)
    });
    warningText.textContent = '';
    addDrawingCapability();
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const col = rgbToHex(`rgb(${r},${g},${b})`);
    return col;
}

function loadFile(e) {
    const selectedFile = loadFileInput.files[0];
    if(selectedFile){
        reader.addEventListener('loadend', (e) => {
            let img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const imgWidth = img.width;
                const imgHeight = img.height;
                console.log(imgHeight);
                console.log(imgWidth);
                if((imgWidth === 16 && imgHeight === 16) || 
                    (imgWidth === 24 && imgHeight === 24) ||
                    (imgWidth === 32 && imgHeight === 32) ||
                    (imgWidth === 48 && imgHeight === 48) ||
                    (imgWidth === 64 && imgHeight === 64)) 
                {
                    changeCanvasSize();
                    const ctx = imageBuffer.getContext('2d');
                    ctx.drawImage(img,0,0);
                } else {
                    fileWarningText.textContent = 'Wrong file dimensions!'
                }
            }
        });
        reader.readAsDataURL(selectedFile);
    }
}

function saveImage() {
    
}