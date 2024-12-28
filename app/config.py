import os
from dotenv import load_dotenv

# Загрузка переменных окружения из .env
load_dotenv()

class Config:
    """
    Основной конфигурационный класс приложения.
    """
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'
    FLASK_RUN_PORT = int(os.getenv('FLASK_RUN_PORT', 5000))
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Базовая директория проекта
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 24 * 1024 * 1024  # Максимальный размер файла 16 MB
    ALLOWED_EXTENSIONS = {'dcm'}

    @staticmethod
    def is_allowed_file(filename):
        """
        Проверка, что файл имеет допустимое расширение.
        """
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True

class ProductionConfig(Config):
    pass
#
#
# import os
# from dotenv import load_dotenv
#
# # Загрузка переменных окружения из .env
# load_dotenv()
#
# class Config:
#     """
#     Основной конфигурационный класс приложения.
#     """
#     SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
#     FLASK_DEBUG = bool(int(os.getenv('FLASK_DEBUG', '1')))  # Приведение к булеву типу
#     FLASK_RUN_PORT = int(os.getenv('FLASK_RUN_PORT', 5000))
#     BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Базовая директория проекта
#     UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
#     MAX_CONTENT_LENGTH = 24 * 1024 * 1024  # Максимальный размер файла 16 MB
#     ALLOWED_EXTENSIONS = {'dcm'}
#
#     @staticmethod
#     def init_app(app):
#         """
#         Инициализация приложения с настройками.
#         """
#         # Создание папки для загрузки файлов, если она не существует
#         upload_folder = app.config['UPLOAD_FOLDER']
#         if not os.path.exists(upload_folder):
#             os.makedirs(upload_folder)
#
#     @staticmethod
#     def is_allowed_file(filename):
#         """
#         Проверка, что файл имеет допустимое расширение.
#         """
#         return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS
#
# class DevelopmentConfig(Config):
#     DEBUG = True
#
# class TestingConfig(Config):
#     TESTING = True
#
# class ProductionConfig(Config):
#     pass