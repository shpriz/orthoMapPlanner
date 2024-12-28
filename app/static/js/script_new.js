

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

        // Расчет правильного scaleFactor
        const actualDiameter = 32.0; // Фактический диаметр окружности в мм
        const detectedDiameter = result.diameter_mm; // Диаметр окружности, обнаруженный алгоритмом
        scaleFactor = result.scale_factor * (actualDiameter / detectedDiameter);

        // Сохраняем информацию о круге
        circleInfo = result.circle;

        // Отображение изображения
        dicomImage.src = result.image_url;
        dicomImage.onload = () => {
            // Применяем scaleFactor к изображению
            canvas.width = dicomImage.width * scaleFactor;
            canvas.height = dicomImage.height * scaleFactor;
            ctx.drawImage(dicomImage, 0, 0, canvas.width, canvas.height);

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


// Функции для рисования окружности и текста
function drawCircleAndText(circle, actualDiameter) {
    const { x, y, r } = circle;

    // Рисуем зеленую окружность
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x * scaleFactor, y * scaleFactor, r * scaleFactor, 0, Math.PI * 2);
    ctx.stroke();

    // Рисуем текст в центре окружности
    ctx.fillStyle = 'lime';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Diameter: ${actualDiameter.toFixed(2)} mm`, x * scaleFactor, y * scaleFactor);
}

// Обработчик для кликов на canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scaleFactor;
    const y = (e.clientY - rect.top) / scaleFactor;

    points.push({ x, y });
    drawnPoints.push({ x, y });

    drawPoint(x, y);

    // Рисуем дугу между первой и второй точкой
    if (measurementType.value === 'arc' && points.length === 2) {
        const start = points[0];
        const end = points[1];
        const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) * scaleFactor;
        drawLineWithMeasurement(start, end, distance);
    }
});

// Функция для рисования линии с измерением
function drawLineWithMeasurement(start, end, distance) {
    ctx.beginPath();
    ctx.moveTo(start.x * scaleFactor, start.y * scaleFactor);
    ctx.lineTo(end.x * scaleFactor, end.y * scaleFactor);
    ctx.strokeStyle = 'orange'; // Устанавливаем цвет линии
    ctx.lineWidth = 2;
    ctx.stroke();

    // Добавляем текст с длиной линии рядом со второй точкой
    ctx.fillStyle = 'black'; // Цвет текста
    ctx.font = '12px Arial'; // Шрифт и размер текста
    ctx.textAlign = 'left'; // Выравнивание текста слева
    ctx.textBaseline = 'top'; // Базовая линия текста сверху
    ctx.fillText(`${distance.toFixed(2)} мм`, end.x * scaleFactor + 10, end.y * scaleFactor); // Показываем расстояние рядом с конечной точкой
}

// Функция для рисования точки
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x * scaleFactor, y * scaleFactor, 4, 0, Math.PI * 2); // Радиус маркера увеличен до 4 пикселя
    ctx.fillStyle = 'blue'; // Цвет маркеров
    ctx.fill();
}

// Функция для очистки измерений
document.getElementById('clearButton').addEventListener('click', () => {
    clearMeasurements();
});

// Очистка всех измерений
function clearMeasurements() {
    points = [];
    drawnLines = [];
    drawnPoints = [];
    canvas.clearRect(); // Очищаем canvas
    ctx.clearRect(); // Очищаем контекст canvas
    canvas.width = dicomImage.width * scaleFactor;
    canvas.height = dicomImage.height * scaleFactor;
    ctx.drawImage(dicomImage, 0, 0, canvas.width, canvas.height);
    drawCircleAndText(circleInfo, actualDiameter);
};

// Функция для рисования линии с измерением
function drawLineWithMeasurement(start, end, distance) {
    ctx.beginPath();
    ctx.moveTo(start.x * scaleFactor, start.y * scaleFactor);
    ctx.lineTo(end.x * scaleFactor, end.y * scaleFactor);
    ctx.strokeStyle = 'orange'; // Устанавливаем цвет линии
    ctx.lineWidth = 2;
    ctx.stroke();

    // Добавляем текст с длиной линии рядом со второй точкой
    ctx.fillStyle = 'black'; // Цвет текста
    ctx.font = '12px Arial'; // Шрифт и размер текста
    ctx.textAlign = 'left'; // Выравнивание текста слева
    ctx.textBaseline = 'top'; // Базовая линия текста сверху
    ctx.fillText(`${distance.toFixed(2)} мм`, end.x * scaleFactor + 10, end.y * scaleFactor); // Показываем расстояние рядом с конечной точкой
}

// Функция для рисования точки
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x * scaleFactor, y * scaleFactor, 4, 0, Math.PI * 2); // Радиус маркера увеличен до 4 пикселя
    ctx.fillStyle = 'blue'; // Цвет маркеров
    drawnPoints.push({ x, y });
    ctx.fill();
}

// Обработка кликов на canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scaleFactor;
    const y = (e.clientY - rect.top) / scaleFactor;

    points.push({ x, y });
    drawnPoints.push({ x, y });

    drawPoint(x, y);

    // Рисуем дугу между первой и второй точкой
    if (measurementType.value === 'arc' && points.length === 2) {
        const start = points[0];
        const end = points[1];
        const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) * scaleFactor;
        drawLineWithMeasurement(start, end, distance);
    }
});