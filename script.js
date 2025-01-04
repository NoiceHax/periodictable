
const elements = [
    {id: 1, symbol: 'H', name: 'Hydrogen', group: 1, period: 1},
    {id: 2, symbol: 'He', name: 'Helium', group: 18, period: 1},
    {id: 3, symbol: 'Li', name: 'Lithium', group: 1, period: 2},
    {id: 4, symbol: 'Be', name: 'Beryllium', group: 2, period: 2},
    {id: 5, symbol: 'B', name: 'Boron', group: 13, period: 2},
    {id: 6, symbol: 'C', name: 'Carbon', group: 14, period: 2},
    {id: 7, symbol: 'N', name: 'Nitrogen', group: 15, period: 2},
    {id: 8, symbol: 'O', name: 'Oxygen', group: 16, period: 2},
    {id: 9, symbol: 'F', name: 'Fluorine', group: 17, period: 2},
    {id: 10, symbol: 'Ne', name: 'Neon', group: 18, period: 2},
    {id: 11, symbol: 'Na', name: 'Sodium', group: 1, period: 3},
    {id: 12, symbol: 'Mg', name: 'Magnesium', group: 2, period: 3},
    {id: 13, symbol: 'Al', name: 'Aluminum', group: 13, period: 3},
    {id: 14, symbol: 'Si', name: 'Silicon', group: 14, period: 3},
    {id: 15, symbol: 'P', name: 'Phosphorus', group: 15, period: 3},
    {id: 16, symbol: 'S', name: 'Sulfur', group: 16, period: 3},
    {id: 17, symbol: 'Cl', name: 'Chlorine', group: 17, period: 3},
    {id: 18, symbol: 'Ar', name: 'Argon', group: 18, period: 3},
    {id: 19, symbol: 'K', name: 'Potassium', group: 1, period: 4},
    {id: 20, symbol: 'Ca', name: 'Calcium', group: 2, period: 4}
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createElementDiv(element) {
    const div = document.createElement('div');
    div.className = 'element';
    div.draggable = true;
    div.innerHTML = `
<div class="symbol">${element.symbol}</div>
<div class="name">${element.name}</div>
    `;
    div.dataset.element = JSON.stringify(element);
    return div;
}

function shouldElementExist(group, period) {
    if (period === 1) return group === 1 || group === 18;
    if (period === 2 || period === 3) return group <= 2 || group >= 13;
    if (period === 4) return group <= 2;
    return false;
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    setTimeout(() => {
feedback.textContent = '';
feedback.className = 'feedback';
    }, 2000);
}

function checkVictory() {
    const cells = document.querySelectorAll('.cell');
    let allCorrect = true;
    let placedCount = 0;

    cells.forEach(cell => {
if (cell.dataset.currentElement) {
    placedCount++;
    const element = JSON.parse(cell.dataset.currentElement);
    const group = parseInt(cell.dataset.group);
    const period = parseInt(cell.dataset.period);
    if (element.group !== group || element.period !== period) {
allCorrect = false;
    }b
} else {
    if (shouldElementExist(parseInt(cell.dataset.group), parseInt(cell.dataset.period))) {
allCorrect = false;
    }
}
    });

    if (allCorrect && placedCount > 0) {
const victory = document.createElement('div');
victory.className = 'victory';
victory.textContent = '🎉 Congratulations! All elements placed correctly! 🎉';
document.body.appendChild(victory);
setTimeout(() => victory.remove(), 3000);
    }
}

function initializeTable() {
    const library = document.getElementById('elementLibrary');
    const grid = document.getElementById('periodicGrid');
    
    document.getElementById('feedback').textContent = '';
    const victory = document.querySelector('.victory');
    if (victory) victory.remove();

    const shuffledElements = shuffleArray([...elements]);
    library.innerHTML = '';
    shuffledElements.forEach(element => {
library.appendChild(createElementDiv(element));
    });

    grid.innerHTML = '';
    for (let period = 1; period <= 4; period++) {
for (let group = 1; group <= 18; group++) {
    if (shouldElementExist(group, period)) {
const cell = document.createElement('div');
cell.className = 'cell';
cell.dataset.group = group;
cell.dataset.period = period;
const element = elements.find(e => e.group === group && e.period === period);
cell.innerHTML = `<div class="cell-number">${element.id}</div>`;
grid.appendChild(cell);
    } else {
const spacer = document.createElement('div');
grid.appendChild(spacer);
    }
}
    }
}

document.addEventListener('DOMContentLoaded', initializeTable);

document.addEventListener('dragstart', (e) => {
    if (e.target.className === 'element') {
e.dataTransfer.setData('text/plain', e.target.dataset.element);
    }
});

document.addEventListener('dragover', (e) => {
    if (e.target.closest('.cell')) {
e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) {
e.preventDefault();
const element = JSON.parse(e.dataTransfer.getData('text/plain'));
const group = parseInt(cell.dataset.group);
const period = parseInt(cell.dataset.period);

const isCorrect = element.group === group && element.period === period;
const cellNumber = cell.querySelector('.cell-number').outerHTML;
cell.innerHTML = `
    ${cellNumber}
    <div class="symbol">${element.symbol}</div>
    <div class="name">${element.name}</div>
`;
cell.className = `cell ${isCorrect ? 'correct' : 'incorrect'}`;
cell.dataset.currentElement = JSON.stringify(element);

showFeedback(
    isCorrect ? 'Correct placement!' : 'Try again - check the element\'s properties',
    isCorrect ? 'success' : 'error'
);

checkVictory();
    }
});

document.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) {
const element = elements.find(e => 
    e.group === parseInt(cell.dataset.group) && 
    e.period === parseInt(cell.dataset.period)
);
cell.innerHTML = `<div class="cell-number">${element.id}</div>`;
cell.className = 'cell';
delete cell.dataset.currentElement;
    }
});