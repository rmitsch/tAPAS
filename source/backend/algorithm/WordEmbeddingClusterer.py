from sklearn.datasets import make_blobs
import pandas as pd
import hdbscan as hdbscan_lib
import pydpc
import numpy


class WordEmbeddingClusterer:
    """
    Wrapper for word embedding clustering.
    """

    def __init__(self, word_embedding):
        """
        Data frame containing word vectors and indices.
        :param word_embedding:
        """
        self.word_embedding = word_embedding

    def run(self):
        # Stack vectors so scikit-learn/HDBSCAN accepts the data; start clustering.
        data = numpy.stack(self.word_embedding['values'].values, axis=0)
        clu = pydpc.Cluster(data, fraction=0.2)
        clu.assign(16, 1.54)

        return clu.membership
