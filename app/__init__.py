import os
from flask import Flask
from .config import Config

def create_app():
    """
    Создает и настраивает приложение Flask.
    """
    app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')
    app.config.from_object(Config)

    # Загрузка конфигурации
    app.config.from_object(Config)

    # Создание папки для загрузки файлов, если она не существует
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Регистрация blueprint'ов
    from .routes import main
    app.register_blueprint(main)

    return app
