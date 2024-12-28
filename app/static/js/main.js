// main.js

import { handleDistanceMeasurement, handleAngleMeasurement } from './measurements.js';
console.log("Скрипт main.js загружен!");

// Инициализация необходимых переменных
let points = [];
let drawnPoints = []; // Массив для хранения нарисованных точек
let drawnLines = [];  // Массив для хранения нарисованных линий
let scaleFactor = 1;  // Начальный масштаб
let anglePoints = []; // Точки для измерения угла


// Получаем необходимые элементы DOM
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

const canvasContainer = document.getElementById('canvasContainer');
const controlsSection = document.getElementById('controls-section');
const dicomFileInput = document.getElementById('dicomFile');

// Определение глобальной переменной
let resultsContainer;

// Отложенная инициализация
document.addEventListener('DOMContentLoaded', () => {
    resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
        console.error("Элемент с ID 'results' не найден!");
    } else {
        console.log("resultsContainer найден в main.js", resultsContainer);
    }
});


// Обработчик для смены типа измерения
document.getElementById('measurementType').addEventListener('change', (e) => {
    currentMeasurementType = e.target.value;

    if (currentMeasurementType === 'angle') {
        anglePoints = [];  // Сбрасываем точки для угла
    } else {
        points = [];  // Сбрасываем точки для других измерений
    }
});

document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = dicomFileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Show the progress bar and set its initial state
    document.getElementById('progressContainer').style.display = 'block';
    let progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', 0);

    try {
        // Simulate file upload progress
        let uploadProgress = 0;
        const uploadInterval = setInterval(() => {
            uploadProgress += 10; // Increase progress by 10% each interval
            if (uploadProgress >= 100) {
                clearInterval(uploadInterval); // Stop the progress simulation
            }
            progressBar.style.width = uploadProgress + '%';
            progressBar.setAttribute('aria-valuenow', uploadProgress);
        }, 200); // Simulate upload progress in 200ms intervals

        // Upload the DICOM file
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        clearInterval(uploadInterval); // Stop simulating upload once the file is uploaded
        progressBar.style.width = '100%'; // Set the progress bar to 100%

        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return;
        }

        // Process DICOM result here
        const detectedDiameter = result.diameter_mm;
        scaleFactor = result.scale_factor;
        scaleFactor = adjustScaleFactor({ scale_factor: scaleFactor, diameter_mm: detectedDiameter });

        // Update the image and show results
        const imageUrl = result.image_url;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
            ctx.drawImage(img, 0, 0);

            // Hide progress bar and show results
            document.getElementById('progressContainer').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            resultsContainer.innerHTML = `
                <p>Scale Factor: ${scaleFactor.toFixed(2)}</p>
                <p>Detected Diameter: ${detectedDiameter.toFixed(2)} mm</p>
                <p>Image URL: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
            `;
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload DICOM file');
        document.getElementById('progressContainer').style.display = 'none';
    }
});




// Функция для корректировки масштаба, если окружность на изображении имеет известный диаметр
function adjustScaleFactor(result) {
    const actualDiameter = 32;  // Известный реальный диаметр окружности (мм)
    const detectedDiameter = result.diameter_mm;  // Диаметр окружности, найденный на изображении (мм)
    console.log("detectedDiameter = ", detectedDiameter.toFixed(2));

    // Масштаб с учетом найденного диаметра
    return result.scale_factor * (actualDiameter / detectedDiameter);
}


// Обработчик клика по канвасу
let currentMeasurementType = 'line'; // Тип текущего измерения, по умолчанию - расстояние

// Обработчик клика по канвасу
canvas?.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Добавляем точку для выбранного инструмента измерения
    if (currentMeasurementType === 'line') {
        points.push({ x, y });
        drawPoint(x, y);  // Рисуем точку
        handleDistanceMeasurement(points, ctx, scaleFactor, drawnLines, drawnPoints, canvas, resultsContainer);
    } else if (currentMeasurementType === 'angle') {
        anglePoints.push({ x, y });
        drawPoint(x, y);  // Рисуем точку
        if (anglePoints.length === 3) {
            handleAngleMeasurement(anglePoints, ctx, resultsContainer);  // Передаем 3 точки для угла
        }
    }
});

// Функция для рисования точки
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2); // Размер маркера
    ctx.fillStyle = 'orange'; // Цвет маркера
    ctx.fill();
}

// Сбрасываем точки для измерения угла, если переключаемся на другой инструмент
function resetAngleMeasurement() {
    anglePoints = []; // Сброс точек угла
}






