FROM kennethreitz/pipenv

EXPOSE 8000

COPY . /app

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--log-file", "-"]
