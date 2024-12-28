// РАБОТАЕТ!!!
const dicomFileInput = document.getElementById('dicomFile');
const dicomImage = document.getElementById('dicomImage');
const resultsContainer = document.getElementById('results');
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const measurementType = document.getElementById('measurementType');

let points = [];
let scaleFactor = 1;
let circleInfo = null;
let isArcDrawing = false;
let drawnLines = [];  // Сохраняем линии
let drawnPoints = []; // Сохраняем точки

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24 MB
    const file = dicomFileInput.files[0];

    if (file && file.size > MAX_FILE_SIZE) {
        alert('File is too large! Please upload a file smaller than 24 MB.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload DICOM file');
        }

        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return;
        }

        // Корректируем масштабный коэффициент для учета фактической длины окружности
        const actualDiameter = 32.0; // Фактический диаметр окружности в мм
        const detectedDiameter = result.diameter_mm; // Диаметр окружности, обнаруженный алгоритмом
        scaleFactor = result.scale_factor * (actualDiameter / detectedDiameter);

        // Сохраняем информацию о круге
        circleInfo = result.circle;

        // Отображение изображения
        dicomImage.src = result.image_url;
        dicomImage.onload = () => {
            scaleFactor = calculateScaleFactor();

            canvas.width = dicomImage.width;
            canvas.height = dicomImage.height;
            ctx.drawImage(dicomImage, 0, 0);

            // Рисуем зеленую окружность и текст
            if (circleInfo) {
                drawCircleAndText(circleInfo, actualDiameter);
            }

            // Отрисовываем сохраненные линии и точки
            drawnLines.forEach(line => drawLineWithMeasurement(line.start, line.end, line.distance));
            drawnPoints.forEach(point => drawPoint(point.x, point.y));
        };

        // Отображение результатов
        resultsContainer.innerHTML = `
            <p>Detected Diameter: ${result.diameter_mm.toFixed(2)} mm</p>
            <p>Corrected Scale Factor: ${scaleFactor.toFixed(2)}</p>
        `;
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload DICOM file');
    }
});

// Функция для рисования окружности и текста
function drawCircleAndText(circle, actualDiameter) {
    const { x, y, r } = circle;

    // Рисуем зеленую окружность
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    // Рисуем текст в центре окружности
    ctx.fillStyle = 'lime';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Diameter: ${actualDiameter.toFixed(2)} mm`, x, y);
}

// Обработчик для кликов на canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.push({ x, y });
    drawnPoints.push({ x, y });

    drawPoint(x, y);

    // Рисуем дугу между первой и второй точкой
    if (measurementType.value === 'arc' && points.length === 2) {
        isArcDrawing = true;
    }

    // Когда выбраны 2 точки, начинаем рисовать дугу
    if (measurementType.value === 'arc' && points.length === 2) {
        // Рисуем дугу между двумя точками и следим за курсором мыши
        drawArcPreview(points[0], points[1], { x, y });
    }

    // Обрабатываем измерение угла
    if (measurementType.value === 'angle' && points.length >= 3) {
        const p1 = points[points.length - 3];
        const p2 = points[points.length - 2];
        const p3 = points[points.length - 1];
        const angle = calculateAngle(p1, p2, p3);
        resultsContainer.innerHTML += `<p>Angle: ${angle.toFixed(2)}°</p>`;
    }

    // Обрабатываем измерение расстояния
    if (measurementType.value === 'line' && points.length % 2 === 0) {
        const p1 = points[points.length - 2];
        const p2 = points[points.length - 1];
        const distance = calculateDistance(p1, p2);
        const midpoint = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(`${distance.toFixed(2)} mm`, midpoint.x, midpoint.y);
        drawnLines.push({ start: p1, end: p2, distance });

        // Рисуем линию между точками
        drawLineBetweenPoints(p1, p2);
    }
});

// Функция для рисования линии с результатом измерения
function drawLineWithMeasurement(start, end, distance) {
    // Нарисуем линию оранжевого цвета
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'orange'; // Устанавливаем цвет линии
    ctx.lineWidth = 2;
    ctx.stroke();

    // Добавляем текст с длиной линии рядом со второй точкой

    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';

    ctx.font = '12px Arial'; // Шрифт и размер текста
    ctx.textBaseline = 'bottom'; // Базовая линия текста сверху
    ctx.fillText(`${distance.toFixed(2)} мм`, end.x, end.y - 500); // Показываем расстояние рядом с конечной точкой
}

// Также изменим функцию drawPoint, чтобы она корректно обрабатывала маркеры
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2); // Радиус маркера увеличен до 4 пикселя
    ctx.fillStyle = 'orange'; // Цвет маркеров
    ctx.fill();
}



// Функция для вычисления расстояния между двумя точками
function calculateDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
    const realDistanceMM = distanceInPixels * scaleFactor;
    return realDistanceMM;
}



/// Функция для вычисления угла между тремя точками
function calculateAngle(p1, p2, p3) {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const crossProduct = v1.x * v2.y - v1.y * v2.x;
    let angle = Math.atan2(crossProduct, dotProduct);
    if (angle < 0) angle += 2 * Math.PI;
    return angle * 180 / Math.PI;
}

// Кнопка сброса
document.querySelector('#clearButton').addEventListener('click', () => {
    points = [];
    drawnLines = [];
    drawnPoints = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dicomImage, 0, 0);
});


// Функция для расчета масштабного коэффициента
function calculateScaleFactor() {
    const actualDiameter = 32.0; // Реальный диаметр окружности в мм
    const measuredDiameter = 255; // Измеренное значение диаметра на экране
    return actualDiameter / measuredDiameter;
}

// Функция для рисования дуги
function drawArcPreview(p1, p2, cursorPos) {
    const dx = cursorPos.x - p1.x;
    const dy = cursorPos.y - p1.y;
    const angle = Math.atan2(dy, dx);
    const radius = Math.sin(angle) * (cursorPos.radialphoese - p1.radius);
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, radius, 0, angle, false);
    ctx.stroke();
}

// Добавляем функцию для рисования линии между точками
function drawLineBetweenPoints(start, end) {
    ctx.beginPath();
    ctx.strokeStyle = 'orange';

    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}
