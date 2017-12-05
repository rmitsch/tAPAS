import sklearn.cluster
import numpy


class WordEmbeddingClusterer:
    """
    Wrapper for word embedding clustering.
    """

    def __init__(self, data):
        """
        Data frame containing word vectors and indices.
        :param word_embedding:
        """
        self.data = data

    # s

    def run(self):
        """
        Runs clustering on specified word embedding.
        :return: Cluster labels.
        """
        # Assume one cluster per 10% of words.
        kmeans_model = sklearn.cluster.MiniBatchKMeans(
            init='k-means++',
            init_size=int(self.data.shape[0] / 10 * 3),
            max_iter=3000,
            n_clusters=int(self.data.shape[0] / 10)
        )
        kmeans_model.fit(self.data)

        return kmeans_model.labels_

    @staticmethod
    def prepare_word_embedding_dataset(word_embedding):
        """
        Auxiliary method preparing data in word embedding dataframe for clustering process.
        :param word_embedding: Dataframe with word embedding; containing column "values" for vectors.
        :return: Data in format needed for clustering.
        """

        # Stack vectors so scikit-learn/HDBSCAN accepts the data; start clustering.
        return numpy.stack(word_embedding['values'].values, axis=0)

