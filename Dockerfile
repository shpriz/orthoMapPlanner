FROM python:3.10

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app


COPY requirements.txt .
RUN pip install --upgrade pip  && \
    pip install --no-cache-dir -r requirements.txt


# Копируем файлы приложения внутрь контейнера
COPY . ./

ENV FLASK_APP=run.py

# Устанавливаем зависимости из requirements.txt
RUN apt-get update && \
    apt-get install -y libsm6 libxext6 libxrender-dev libgl1-mesa-glx
# Открываем порт 5000 для доступа к приложению
EXPOSE 80

# Запускаем приложение при старте контейнера
CMD ["flask", "run", "--host=0.0.0.0"]