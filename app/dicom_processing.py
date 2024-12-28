import pydicom
import cv2
import numpy as np
import os
from flask import current_app
import uuid



import os
import cv2
import uuid
import numpy as np
import pydicom
from flask import current_app

import os
import cv2
import uuid
import numpy as np
import pydicom
from flask import current_app

import os
import cv2
import uuid
import numpy as np
import pydicom
from flask import current_app

def process_dicom(filepath):
    try:
        # Читаем DICOM файл
        dicom_data = pydicom.dcmread(filepath)
        image = dicom_data.pixel_array
        pixel_spacing = getattr(dicom_data, "PixelSpacing", None)
        if not pixel_spacing or len(pixel_spacing) < 2:
            pixel_spacing = [1, 1]  # Если PixelSpacing не указан, используем значение по умолчанию
        pixel_spacing_x, pixel_spacing_y = map(float, pixel_spacing)
        pixel_spacing = (pixel_spacing_x + pixel_spacing_y) / 2  # Усредняем пиксельный шаг

        # Нормализация изображения для отображения
        image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

        # Детектируем круг (для масштаба)
        blurred = cv2.GaussianBlur(image, (9, 9), 2)
        gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)
        circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1.2, minDist=50, param1=100, param2=30)

        diameter_mm = None
        scale_factor = 1
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            largest_circle = max(circles, key=lambda c: c[2])
            x, y, r = largest_circle
            cv2.circle(image, (x, y), r, (0, 255, 0), 2)
            # Диаметр окружности в пикселях
            diameter_px = 2 * r
            # Реальный диаметр окружности (32 мм)
            diameter_mm = 32.0
            # Масштаб: реальный диаметр (32 мм) / измеренный диаметр (в пикселях)
            scale_factor = diameter_mm / diameter_px
            cv2.putText(image, f"Diameter: {diameter_mm:.2f} mm", (x - 50, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # Сохраняем обработанное изображение
        output_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        dicom_image_file_name = str(uuid.uuid4()) + ".png"
        output_path = os.path.join(output_folder, dicom_image_file_name)
        cv2.imwrite(output_path, image)

        return {
            'image_url': f'/static/uploads/{dicom_image_file_name}',
            'diameter_mm': diameter_mm,
            'scale_factor': scale_factor
        }

    except Exception as e:
        print(f"Error processing DICOM file: {e}")
        return {'error': 'Failed to process DICOM file'}




# Работающая версия кода
#
# def process_dicom(filepath):
#     try:
#         # Читаем DICOM файл
#         dicom_data = pydicom.dcmread(filepath)
#         image = dicom_data.pixel_array
#         pixel_spacing = getattr(dicom_data, "PixelSpacing", [1, 1])[0]  # Пиксельный шаг
#
#         # Нормализация изображения для отображения
#         image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
#         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
#
#         # Детектируем круг (для масштаба)
#         blurred = cv2.GaussianBlur(image, (9, 9), 2)
#         gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)
#         circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1.2, minDist=50, param1=100, param2=30)
#
#         diameter_mm = None
#         scale_factor = 1
#         if circles is not None:
#             circles = np.round(circles[0, :]).astype("int")
#             largest_circle = max(circles, key=lambda c: c[2])
#             x, y, r = largest_circle
#             cv2.circle(image, (x, y), r, (0, 255, 0), 2)
#             diameter_mm = 2 * r * pixel_spacing
#             scale_factor = 32.0 / diameter_mm if diameter_mm > 0 else 1.0
#             cv2.putText(image, f"Diameter: {diameter_mm:.2f} mm", (x - 50, y - 10),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
#
#         # Сохраняем обработанное изображение
#         # output_folder = os.path.join(current_app.config['UPLOAD_FOLDER'])
#         # if not os.path.exists(output_folder):
#         #     os.makedirs(output_folder)
#         dicom_image_file_name = str(uuid.uuid4()) + ".png"
#         output_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dicom_image_file_name)
#         print(f"Saving processed image at: {output_path}")
#
#
#         cv2.imwrite(output_path, image)
#
#         return {
#             # 'image_url': f'/{output_path.replace(os.sep, "/")}',
#             'image_url': f'/static/uploads/{dicom_image_file_name}',
#             'diameter_mm': diameter_mm,
#             'scale_factor': scale_factor
#         }
#
#
#     except Exception as e:
#         print(f"Error processing DICOM file: {e}")
#         return {'error': 'Failed to process DICOM file'}




# import pydicom
# import cv2
# import numpy as np
# import os
# from flask import current_app
# import uuid
#
# def process_dicom(filepath):
#     try:
#         # Читаем DICOM файл
#         dicom_data = pydicom.dcmread(filepath)
#         image = dicom_data.pixel_array
#         pixel_spacing = getattr(dicom_data, "PixelSpacing", [1, 1])[0]  # Пиксельный шаг
#
#         # Нормализация изображения для отображения
#         image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
#         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
#
#         # Детектируем круг (для масштаба)
#         blurred = cv2.GaussianBlur(image, (9, 9), 2)
#         gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)
#         circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1.2, minDist=50, param1=100, param2=30)
#
#         diameter_mm = None
#         scale_factor = 1
#         if circles is not None:
#             circles = np.round(circles[0, :]).astype("int")
#             largest_circle = max(circles, key=lambda c: c[2])
#             x, y, r = largest_circle
#             cv2.circle(image, (x, y), r, (0, 255, 0), 2)
#             diameter_mm = 2 * r * pixel_spacing
#             scale_factor = 32.0 / diameter_mm if diameter_mm > 0 else 1.0
#             cv2.putText(image, f"Diameter: {diameter_mm:.2f} mm", (x - 50, y - 10),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
#
#         # Сохраняем обработанное изображение
#         dicom_image_file_name = str(uuid.uuid4()) + ".png"
#         output_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dicom_image_file_name)
#         cv2.imwrite(output_path, image)
#
#         return {
#             'image_url': f'/static/uploads/{dicom_image_file_name}',
#             'diameter_mm': diameter_mm,
#             'scale_factor': scale_factor
#         }
#
#     except Exception as e:
#         print(f"Error processing DICOM file: {e}")
#         return {'error': 'Failed to process DICOM file'}
#
#
# def process_dicom(filepath):
#     try:
#         dicom_data = pydicom.dcmread(filepath)
#         image = dicom_data.pixel_array
#         pixel_spacing = getattr(dicom_data, "PixelSpacing", [1, 1])[0]  # Извлечение размера пикселя
#
#         # Нормализация изображения
#         image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
#         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
#
#         # Определение масштаба
#         blurred = cv2.GaussianBlur(image, (9, 9), 2)
#         gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)
#         circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1.2, minDist=50, param1=100, param2=30)
#
#         diameter_mm = None
#         scale_factor = 1
#         if circles is not None:
#             circles = np.round(circles[0, :]).astype("int")
#             largest_circle = max(circles, key=lambda c: c[2])
#             x, y, r = largest_circle
#             cv2.circle(image, (x, y), r, (0, 255, 0), 2)
#             diameter_mm = 2 * r * pixel_spacing
#             scale_factor = pixel_spacing
#
#         # Сохранение изображения
#         # dicom_image_file_name = str(uuid.uuid4()) + ".png"
#         dicom_image_file_name = "processed_dicom" + ".png"
#         output_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dicom_image_file_name)
#         cv2.imwrite(output_path, image)
#
#         return {
#             'image_url': f'/static/uploads/{dicom_image_file_name}',
#             'diameter_mm': diameter_mm,
#             'scale_factor': scale_factor
#         }
#     except Exception as e:
#         print(f"Error processing DICOM file: {e}")
#         return {'error': 'Failed to process DICOM file'}
#
#
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'dcm'}