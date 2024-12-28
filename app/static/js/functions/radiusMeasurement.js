// radiusMeasurement.js
export function handleRadiusMeasurement(points, ctx, scaleFactor) {
    if (points.length === 2) {
        const p1 = points[points.length - 2];
        const p2 = points[points.length - 1];
        const radius = calculateRadius(p1, p2, scaleFactor);
        ctx.fillStyle = 'blue';
        ctx.font = '12px Arial';
        ctx.fillText(`Radius: ${radius.toFixed(2)} mm`, p2.x, p2.y);
    }
}

// Helper function to calculate radius
function calculateRadius(p1, p2, scaleFactor) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
    const realRadiusMM = distanceInPixels * scaleFactor;
    return realRadiusMM;
}
