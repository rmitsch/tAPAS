import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
from backend.algorithm.QVEC import QVECConfiguration
import numpy
import pydpc
import matplotlib as mpl
import matplotlib.pyplot as plt
import pickle
import hdbscan
import sklearn.cluster
from MulticoreTSNE import MulticoreTSNE as MulticoreTSNE


db_connector = Utils.connect_to_database(False)

word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec")
word_embedding_small = word_embedding.head(n=100)

stacked_wordvectors = numpy.stack(word_embedding['values'].values, axis=0)

tsne = MulticoreTSNE(n_components=2,
                     method='barnes_hut',
                     metric='euclidean',
                     # todo Remove after tests are done.
                     perplexity=2,
                     # todo Remove after tests are done.
                     angle=0.9,
                     verbose=1,
                     n_jobs=2)
# Train TSNE on gensim's model.
tsne_results = tsne.fit_transform(stacked_wordvectors)
