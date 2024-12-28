const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const resultsContainer = document.getElementById('results');
const dicomImage = document.getElementById('dicomImage');

let points = [];
let scaleFactor = 1;

// Canvas click handler
canvas.addEventListener('click', (e) => {
    if (!activeMode) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    points.push({ x, y });

    if (activeMode === 'distance' && points.length === 2) {
        const distance = calculateDistance(points[0], points[1]);
        drawLineWithMeasurement(points[0], points[1], distance);
        points = [];
        activeMode = null; // Deactivate mode
    }

    if (activeMode === 'angle' && points.length === 3) {
        const angle = calculateAngle(points[0], points[1], points[2]);
        drawAngle(points[0], points[1], points[2], angle);
        points = [];
        activeMode = null; // Deactivate mode
    }
});

// Helper functions
function calculateDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    return pixelDistance * scaleFactor;
}

function calculateAngle(p1, p2, p3) {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const cross = v1.x * v2.y - v1.y * v2.x;
    let angle = Math.atan2(cross, dot) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle;
}

function drawLineWithMeasurement(p1, p2, distance) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(`${distance.toFixed(2)} mm`, p2.x + 10, p2.y);
}

function drawAngle(p1, p2, p3, angle) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'blue';
    ctx.font = '12px Arial';
    ctx.fillText(`${angle.toFixed(1)}°`, p2.x + 10, p2.y);
}
