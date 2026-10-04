// Sample SVG series data - replace with actual series implementation
const svgSeries = [
    '<svg width="100" height="100"><rect width="100" height="100" fill="red"/></svg>',
    '<svg width="100" height="100"><rect width="100" height="100" fill="green"/></svg>',
    '<svg width="100" height="100"><rect width="100" height="100" fill="blue"/></svg>',
    '<svg width="100" height="100"><rect width="100" height="100" fill="yellow"/></svg>',
    '<svg width="100" height="100"><rect width="100" height="100" fill="purple"/></svg>'
];

let currentFrame = 0;
let seriesSize = 5;

const svgContainer = document.getElementById('svg-container');
const frameInput = document.getElementById('frame-input');
const sizeInput = document.getElementById('size-input');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function updatePreview() {
    // Validate current frame
    currentFrame = Math.max(0, Math.min(currentFrame, seriesSize - 1));
    
    // Update SVG display
    svgContainer.innerHTML = svgSeries[currentFrame] || '';
    
    // Update inputs
    frameInput.value = currentFrame;
    frameInput.max = seriesSize - 1;
    sizeInput.value = seriesSize;
}

function changeFrame(delta) {
    currentFrame += delta;
    updatePreview();
}

function jumpToFrame(index) {
    currentFrame = parseInt(index) || 0;
    updatePreview();
}

function updateSeriesSize(newSize) {
    seriesSize = Math.max(1, parseInt(newSize) || 1);
    // Adjust current frame if out of bounds
    currentFrame = Math.min(currentFrame, seriesSize - 1);
    updatePreview();
}

// Event Listeners
prevBtn.addEventListener('click', () => changeFrame(-1));
nextBtn.addEventListener('click', () => changeFrame(1));
frameInput.addEventListener('change', (e) => jumpToFrame(e.target.value));
sizeInput.addEventListener('change', (e) => updateSeriesSize(e.target.value));

// Initialize
updatePreview();
