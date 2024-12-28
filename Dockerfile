# Используем официальный образ Python
FROM python:3.9-slim

# Устанавливаем необходимые зависимости для OpenCV и Flask
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем requirements.txt в контейнер
COPY requirements.txt /app/

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все файлы проекта в контейнер
COPY . /app

# Открываем порт для Flask
EXPOSE 5000

# Команда для запуска приложения
CMD ["python", "run.py"]
