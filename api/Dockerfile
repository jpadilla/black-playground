FROM python:3.6-alpine

EXPOSE 8000

WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN apk add --no-cache --virtual .build-deps git && \
    pip install pipenv && \
    pipenv install --deploy --system && \
    pip uninstall -y pipenv && \
    apk del .build-deps && \
    rm -rf /root/.cache

COPY . /app

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--log-file", "-"]
