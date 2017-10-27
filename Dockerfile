FROM rmitsch/alpine-python-nlp

MAINTAINER Raphael Mitsch <r.mitsch@hotmail.com>

##########################################
# 1. Copy relevant files into container.
##########################################

# Copy file with python requirements into container.
COPY setup/requirements.txt /tmp/requirements.txt
# Copy setup file.
COPY setup/setup.sh /tmp/setup.sh
# Copy source code.
COPY /source /source

# Allow execution of setup scripts.
RUN chmod +x /tmp/setup.sh

##########################################
# 2. Install dependencies.
##########################################

RUN apk update && \
	# cmake for installing dependencies.
	apk add build-base=0.4-r1 && \
	apk add cmake=3.6.3-r0 && \
	# git for pulling Multicore-t-SNE from git.
	apk add git=2.11.3-r0 && \
	# Install postgres driver.
	apk add postgresql-dev=9.6.5-r0 && \
	# Install python dependencies.
	pip install -r /tmp/requirements.txt && \
	# Execute additional setup and clean up build environment.
	./tmp/setup.sh && \
	# Remove build dependencies.
	# To test: Does using numpy (gensim, ...) require build files?
	apk --no-cache del --purge build-deps && \
	apk del cmake && \
	apk del git

##########################################
# 3. Launch server.
##########################################

# Declare which port(s) should be exposed.
EXPOSE 5000

# run the command
CMD ["python", "./source/app.py"]