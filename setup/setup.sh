#!/bin/sh

## Manual setup steps. ##

# Download repository and install package for multi-threaded t-SNE.
pip install --no-cache-dir git+https://github.com/DmitryUlyanov/Multicore-TSNE.git

# Download Reuters corpus.
python -c 'import nltk; nltk.download("reuters")'
python -c 'import nltk; nltk.download("stopwords")'