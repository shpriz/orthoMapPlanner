// Обработчик измерения расстояния
/**
 * Обрабатывает измерение расстояния между двумя точками.
 * @param {Array} points - Массив точек, где каждая точка имеет свойства x и y.
 * @param {CanvasRenderingContext2D} ctx - Контекст рисования для канваса.
 * @param {number} scaleFactor - Масштабный коэффициент для пересчета расстояний в мм.
 * @param {Array} drawnLines - Массив линий, нарисованных на канвасе.
 * @param {Array} drawnPoints - Массив точек, нарисованных на канвасе.
 * @param {HTMLCanvasElement} canvas - Канвас, на котором выполняются измерения.
 * @param {HTMLElement} resultsContainer - Элемент для отображения результатов измерений.
 */
// export function handleDistanceMeasurement(points, ctx, scaleFactor, drawnLines, drawnPoints, canvas, resultsContainer) {
//     if (points.length < 2) {
//         console.warn('Недостаточно точек для измерения расстояния.');
//         return;
//     }
//
//     // Получаем последние две точки
//     const pointA = points[points.length - 2];
//     const pointB = points[points.length - 1];
//
//     // Вычисляем расстояние между точками в пикселях
//     const dx = pointB.x - pointA.x;
//     const dy = pointB.y - pointA.y;
//     const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
//
//     // Переводим расстояние в мм с учетом масштаба
//     const distanceInMm = distanceInPixels * scaleFactor;
//
//     // Рисуем линию между точками
//     ctx.beginPath();
//     ctx.moveTo(pointA.x, pointA.y);
//     ctx.lineTo(pointB.x, pointB.y);
//     ctx.strokeStyle = 'blue';
//     ctx.lineWidth = 2;
//     ctx.stroke();
//
//     // Отображаем длину линии на канвасе
//     const midX = (pointA.x + pointB.x) / 2;
//     const midY = (pointA.y + pointB.y) / 2;
//     ctx.font = '12px Arial';
//     ctx.fillStyle = 'red';
//     ctx.fillText(`${distanceInMm.toFixed(2)} mm`, midX + 5, midY - 5);
//
//     // Сохраняем информацию о линии
//     drawnLines.push({ pointA, pointB, distanceInPixels, distanceInMm });
//
//     // Обновляем результаты в resultsContainer
//     if (resultsContainer) {
//         resultsContainer.style.display = 'block';
//         const resultItem = document.createElement('div');
//         resultItem.textContent = `Расстояние: ${distanceInMm.toFixed(2)} мм (в пикселях: ${distanceInPixels.toFixed(2)})`;
//         resultsContainer.appendChild(resultItem);
//     } else {
//         console.error('resultsContainer не найден.');
//     }
//
//     // Сохраняем нарисованные точки
//     drawnPoints.push(pointA, pointB);
// }



//
// export function handleDistanceMeasurement(points, ctx, scaleFactor, drawnLines, resultsContainer) {
//     if (points.length < 2) {
//         console.log('Недостаточно точек для измерения расстояния.');
//         return;
//     }
//     // Извлекаем точки
//     const pointA = points[0];
//     const pointB = points[1];
//
//     // Вычисляем расстояние
//     const distanceInPixels = Math.sqrt(
//         Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
//     );
//     const distanceInMm = distanceInPixels * scaleFactor;
//
//     // Рисуем линию
//     ctx.beginPath();
//     ctx.moveTo(pointA.x, pointA.y);
//     ctx.lineTo(pointB.x, pointB.y);
//     ctx.strokeStyle = 'blue'; // Цвет линии
//     ctx.lineWidth = 2;        // Толщина линии
//     ctx.stroke();
//
//     // Найти середину линии для размещения текста
//     const midX = (pointA.x + pointB.x) / 2;
//     const midY = (pointA.y + pointB.y) / 2;
//
//     // Отображение текста (расстояния)
//     ctx.font = '14px Arial'; // Шрифт и размер текста
//     ctx.fillStyle = 'red';   // Цвет текста
//     ctx.fillText(`${distanceInMm.toFixed(2)} мм`, midX + 5, midY - 5); // Вывод текста рядом с серединой
//
//     // Сохраняем измерение
//     drawnLines.push({ pointA, pointB, distanceInPixels, distanceInMm });
//
//
//     // Отображаем результат в контейнере
//     resultsContainer.innerHTML += `
//         <p>Расстояние: ${distanceInMm.toFixed(2)} мм (в пикселях: ${distanceInPixels.toFixed(2)})</p>
//     `;
//
//     // Очистка массива точек для нового измерения
//     points.length = 0;
// }







//
// export function handleAngleMeasurement(points, ctx, resultsContainer) {
//     if (points.length >= 3) {
//         const p1 = points[points.length - 3];
//         const p2 = points[points.length - 2];
//         const p3 = points[points.length - 1];
//
//         // Вычисляем угол
//         const angle = calculateAngle(p1, p2, p3);
//
//         // Выводим угол рядом с вершиной угла
//         const angleText = `Angle: ${angle.toFixed(2)}°`;
//         const textX = p2.x + 10;  // Рядом с вершиной угла
//         const textY = p2.y - 10;  // Слегка выше вершины угла
//
//         resultsContainer.innerHTML += `<p>${angleText}</p>`;
//
//         // Рисуем линии и угол
//         drawAngleLines(p1, p2, p3, ctx);
//         ctx.fillText(angleText, textX, textY);
//     } else {
//         resultsContainer.innerHTML += `<p>Недостаточно точек для измерения угла</p>`;
//     }
// }
//
// // Функция для рисования углов
// function drawAngleLines(p1, p2, p3, ctx) {
//     // Рисуем линии между точками
//     ctx.beginPath();
//     ctx.moveTo(p1.x, p1.y);
//     ctx.lineTo(p2.x, p2.y);
//     ctx.moveTo(p3.x, p3.y);
//     ctx.lineTo(p2.x, p2.y);
//     ctx.strokeStyle = 'green';
//     ctx.lineWidth = 2;
//     ctx.stroke();
// }
//
// // Функция для вычисления угла между тремя точками
// function calculateAngle(p1, p2, p3) {
//     const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
//     const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
//
//     const dotProduct = v1.x * v2.x + v1.y * v2.y;
//     const crossProduct = v1.x * v2.y - v1.y * v2.x;
//
//     let angle = Math.atan2(crossProduct, dotProduct);
//     if (angle < 0) angle += 2 * Math.PI;  // Угол в положительной области
//
//     return angle * 180 / Math.PI;  // Преобразуем в градусы
// }
//




let currentMeasurementType = 'line';  // Пример, как отслеживать текущий инструмент
let points = [];  // Массив точек для текущего инструмента (линии)
let anglePoints = [];  // Массив точек для измерения угла

// Слушатель для переключения между инструментами
document.getElementById('measurementType').addEventListener('change', (e) => {
    currentMeasurementType = e.target.value;

    if (currentMeasurementType === 'angle') {
        anglePoints = [];  // Сбрасываем точки для угла
    } else {
        points = [];  // Сбрасываем точки для других измерений
    }
});

// Обработчик для измерения угла
export function handleAngleMeasurement(points, ctx, resultsContainer) {
    // Убедимся, что у нас есть хотя бы 3 точки для измерения угла
    if (points.length >= 3) {
        const p1 = points[points.length - 3]; // Первая точка (в вершине угла)
        const p2 = points[points.length - 2]; // Вершина угла
        const p3 = points[points.length - 1]; // Вторая точка

        // Вычисляем угол между точками
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
        const dotProduct = v1.x * v2.x + v1.y * v2.y;
        const crossProduct = v1.x * v2.y - v1.y * v2.x;
        let angle = Math.atan2(crossProduct, dotProduct);
        if (angle < 0) angle += 2 * Math.PI; // Углы должны быть положительными
        const angleDeg = angle * 180 / Math.PI; // Преобразуем радианы в градусы

        // Рисуем линии между точками
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'green'; // Цвет линии для угла
        ctx.lineWidth = 2;
        ctx.stroke();

        // Отображаем угол на канвасе рядом с вершиной
        const midX = p2.x;
        const midY = p2.y;
        ctx.font = '14px Arial'; // Шрифт и размер текста
        ctx.fillStyle = 'blue';  // Цвет текста
        ctx.fillText(`${angleDeg.toFixed(2)}°`, midX + 5, midY - 5); // Угол рядом с вершиной

        // Выводим угол в контейнер
        resultsContainer.innerHTML += `
            <p>Angle: ${angleDeg.toFixed(2)}°</p>
        `;

        // Очистка массива точек для нового измерения
        points.length = 0;  // Это гарантирует, что следующая точка будет первым элементом
    }
}










// Обработчик для линейных измерений
export function handleDistanceMeasurement(points, ctx, scaleFactor, drawnLines, resultsContainer) {
    if (points.length < 2) {
        console.log('Недостаточно точек для измерения расстояния.');
        return;
    }

    // Извлекаем последние две точки
    const pointA = points[points.length - 2];
    const pointB = points[points.length - 1];

    // Вычисляем расстояние
    const distanceInPixels = Math.sqrt(
        Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
    );
    const distanceInMm = distanceInPixels * scaleFactor;

    // Рисуем линию между точками
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.strokeStyle = 'blue'; // Цвет линии
    ctx.lineWidth = 2;        // Толщина линии
    ctx.stroke();

    // Найти середину линии для отображения текста
    const midX = (pointA.x + pointB.x) / 2;
    const midY = (pointA.y + pointB.y) / 2;

    // Отображение текста (расстояния)
    ctx.font = '14px Arial'; // Шрифт и размер текста
    ctx.fillStyle = 'red';   // Цвет текста
    ctx.fillText(`${distanceInMm.toFixed(2)} мм`, midX + 5, midY - 5); // Вывод текста рядом с серединой

    // Сохраняем измерение в массив линий
    drawnLines.push({ pointA, pointB, distanceInPixels, distanceInMm });

    // Отображаем результат в контейнере
    resultsContainer.innerHTML += `
        <p>Расстояние: ${distanceInMm.toFixed(2)} мм (в пикселях: ${distanceInPixels.toFixed(2)})</p>
    `;

    // Очистка массива точек для нового измерения
    points.length = 0;
}

