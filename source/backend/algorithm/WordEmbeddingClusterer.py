import sklearn.cluster
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
        # Assume one cluster per 10% of words.
        kmeans_model = sklearn.cluster.MiniBatchKMeans(
            init='k-means++',
            init_size=int(data.shape[0] / 10 * 3),
            max_iter=3000,
            n_clusters=int(data.shape[0] / 10)
        )
        kmeans_model.fit(data)

        return kmeans_model.labels_
