FROM python:3.6-alpine

EXPOSE 8000

WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN pip install pipenv && \
    pipenv install --deploy --system && \
    pip uninstall -y pipenv && \
    rm -rf /root/.cache

COPY . /app

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--log-file", "-"]
