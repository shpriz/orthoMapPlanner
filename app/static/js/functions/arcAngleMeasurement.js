// arcAngleMeasurement.js
export function handleArcMeasurement(points, ctx) {
    if (points.length >= 4) {
        const p1 = points[points.length - 4];
        const p2 = points[points.length - 3];
        const p3 = points[points.length - 2];
        const p4 = points[points.length - 1];
        const angle = calculateAngle(p1, p2, p3, p4);
        resultsContainer.innerHTML += `<p>Arc Angle: ${angle.toFixed(2)}°</p>`;
    }
}

// Helper function to calculate the angle for arc
function calculateAngle(p1, p2, p3, p4) {
    // Calculate angle based on intersecting lines
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const crossProduct = v1.x * v2.y - v1.y * v2.x;
    let angle = Math.atan2(crossProduct, dotProduct);
    if (angle < 0) angle += 2 * Math.PI;
    return angle * 180 / Math.PI;
}
