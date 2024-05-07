FROM python:3.12-alpine

EXPOSE 8000

WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN apk add --no-cache --virtual .build-deps build-base git && \
    pip install --upgrade pip pipenv && \
    pipenv install --deploy --system && \
    pip uninstall -y pipenv && \
    apk del .build-deps && \
    rm -rf /root/.cache

COPY . /app

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--log-file", "-"]
