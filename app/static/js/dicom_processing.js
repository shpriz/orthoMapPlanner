// dicom_processing.js
export function uploadDicomFile(file, scaleFactor, circleInfo, dicomImage, canvas, ctx) {
    const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24 MB

    if (file && file.size > MAX_FILE_SIZE) {
        alert('File is too large! Please upload a file smaller than 24 MB.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    return fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            alert(result.error);
            return;
        }

        // Расчет масштабного коэффициента
        const actualDiameter = 32.0; // Фактический диаметр окружности в мм
        const detectedDiameter = result.diameter_mm; // Диаметр окружности, обнаруженный алгоритмом
        scaleFactor = result.scale_factor * (actualDiameter / detectedDiameter);
        circleInfo = result.circle;

        // Отображение изображения
        dicomImage.src = result.image_url;
        dicomImage.onload = () => {
            canvas.width = dicomImage.width;
            canvas.height = dicomImage.height;
            ctx.drawImage(dicomImage, 0, 0);
            if (circleInfo) {
                drawCircleAndText(circleInfo, actualDiameter, ctx);
            }
        };

        return { scaleFactor, circleInfo };
    })
    .catch(error => {
        console.error('Error uploading DICOM file:', error);
        alert('Failed to upload DICOM file');
    });
}

// dicom_processing.js
// dicom_processing.js


//
// export function uploadDicomFile(file, scaleFactor, circleInfo, dicomImage, canvas, ctx) {
//     const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24 MB
//
//     if (file && file.size > MAX_FILE_SIZE) {
//         alert('File is too large! Please upload a file smaller than 24 MB.');
//         return;
//     }
//
//     const formData = new FormData();
//     formData.append('file', file);
//
//     return fetch('/upload', {
//         method: 'POST',
//         body: formData,
//     })
//         .then(response => response.json())
//         .then(result => {
//             if (result.error) {
//                 alert(result.error);
//                 return;
//             }
//
//             const actualDiameter = 32.0; // Фактический диаметр окружности в мм
//             const detectedDiameter = result.diameter_mm; // Диаметр окружности, обнаруженный алгоритмом
//             scaleFactor = result.scale_factor * (actualDiameter / detectedDiameter);
//             circleInfo = result.circle;
//
//             if (!dicomImage) {
//                 console.error('dicomImage is undefined');
//                 return;
//             }
//
//             // Отображение изображения
//             dicomImage.src = result.image_url; // Убедитесь, что result.image_url корректен
//             dicomImage.onload = () => {
//                 canvas.width = dicomImage.width;
//                 canvas.height = dicomImage.height;
//                 ctx.drawImage(dicomImage, 0, 0);
//                 if (circleInfo) {
//                     drawCircleAndText(circleInfo, actualDiameter, ctx);
//                 }
//             };
//
//             return { scaleFactor, circleInfo };
//         })
//         .catch(error => {
//             console.error('Error uploading DICOM file:', error);
//             alert('Failed to upload DICOM file');
//         });
// }

