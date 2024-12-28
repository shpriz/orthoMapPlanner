FROM python:3.10

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы приложения внутрь контейнера
COPY . .

# Устанавливаем зависимости из requirements.txt
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx && \
    pip install -r requirements.txt

# Открываем порт 5000 для доступа к приложению
EXPOSE 5000

# Запускаем приложение при старте контейнера
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]