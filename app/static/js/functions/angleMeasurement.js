// angleMeasurement.js
export function handleAngleMeasurement(points, ctx, resultsContainer) {
    if (points.length >= 3) {
        const p1 = points[points.length - 3];
        const p2 = points[points.length - 2];
        const p3 = points[points.length - 1];
        const angle = calculateAngle(p1, p2, p3);
        resultsContainer.innerHTML += `<p>Angle: ${angle.toFixed(2)}°</p>`;
    }
}

// Helper function to calculate angle
function calculateAngle(p1, p2, p3) {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const crossProduct = v1.x * v2.y - v1.y * v2.x;
    let angle = Math.atan2(crossProduct, dotProduct);
    if (angle < 0) angle += 2 * Math.PI;
    return angle * 180 / Math.PI;
}
