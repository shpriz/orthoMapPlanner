# from flask import Blueprint, render_template, request, jsonify, current_app
# from werkzeug.utils import secure_filename
# from .dicom_processing import process_dicom
# import os
#
# main = Blueprint('main', __name__)
#
# # Главная страница
# @main.route('/')
# def index():
#     return render_template('index.html')
#
# # Загрузка и обработка DICOM файла
# @main.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
#
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
#
#         try:
#             file.save(filepath)
#             print(f"File saved at {filepath}")
#
#             result = process_dicom(filepath)
#             print(f"DICOM processing result: {result}")
#
#             return jsonify(result)
#         except Exception as e:
#             print(f"Error processing DICOM: {e}")
#             return jsonify({'error': 'Failed to process DICOM file'}), 500
#
#     return jsonify({'error': 'Invalid file format'}), 400
#
#
# # Функция проверки разрешений файла
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'dcm'}

# routes.py
from flask import Blueprint, render_template, request, jsonify, current_app
from werkzeug.utils import secure_filename
from .dicom_processing import process_dicom
import os

main = Blueprint('main', __name__)

# Главная страница
@main.route('/')
def index():
    return render_template('index.html')

# Загрузка и обработка DICOM файла
@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

        try:
            file.save(filepath)
            print(f"File saved at {filepath}")

            result = process_dicom(filepath)
            print(f"DICOM processing result: {result}")

            # Возвращаем результат обработки DICOM изображения в формате JSON
            return jsonify(result)
        except Exception as e:
            print(f"Error processing DICOM: {e}")
            return jsonify({'error': 'Failed to process DICOM file'}), 500

    return jsonify({'error': 'Invalid file format'}), 400


# Функция проверки разрешений файла
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'dcm'}
