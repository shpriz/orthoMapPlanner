FROM python:3.10

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app


COPY requirements.txt .
RUN pip install --upgrade pip  && \
    pip install --no-cache-dir -r requirements.txt


# Копируем файлы приложения внутрь контейнера
COPY . ./

ENV FLASK_APP=run.py

EXPOSE 80

# Запускаем приложение при старте контейнера
CMD ["flask", "run", "--host=0.0.0.0"]