# Alpine with Python 2.7 and Node.js 12
FROM nikolaik/python-nodejs:python3.7-nodejs14-alpine

# Install apk library
RUN apk update && \
    apk add \
    curl \
    libxml2 \
    libstdc++ \
    musl \
    linux-headers \
    gcc \
    g++ \
    make \
    gfortran \
    openblas-dev
# Install python-shell
RUN npm install -g python-shell

# Set NODE_PATH
ENV NODE_PATH /usr/local/lib/node_modules
ENV PYTHONPATH /usr/local/bin/python

# Install Poetry
RUN curl -sSL \
    https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | \
    python

# Add to PATH
ENV PATH $PATH:/root/.poetry/bin

# Disable virtualenvs
RUN poetry config virtualenvs.create false

# Disable pyc
ENV PYTHONDONTWRITEBYTECODE 1

