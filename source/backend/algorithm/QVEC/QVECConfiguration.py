from .QVEC import GetVocab
from .QVEC import ReadOracleMatrix
from .QVEC import ComputeCCA
import numpy
import os


class QVECConfiguration:
    """
    Wrapper for QVEC algorithm for easier usage.
    """

    def __init__(self):
        curr_path = os.path.dirname(os.path.realpath(__file__))
        self.oracle_files = [curr_path + "/oracles/semcor_noun_verb.supersenses.en",
                             curr_path + "/oracles/ptb.pos_tags"]
        self.vocab_oracle = GetVocab(self.oracle_files, vocab_union=True)
        self.vocab_vectors = None
        self.vocab_set = None
        self.oracle_matrix = None
        self.vsm_matrix = None

    def run(self, word_embedding):
        """
        Calculates QVEC-CCA score for specified word embedding.
        Overwrites previous values for word embedding-specific variables (as opposed to the oracle-related data).
        :return:
        """

        self.vocab_vectors = word_embedding.index.values
        self.vocab_set = set(self.vocab_vectors) & set(self.vocab_oracle)

        self.oracle_matrix = ReadOracleMatrix(self.oracle_files, self.vocab_set)
        self.vsm_matrix = self._read_vector_matrix_from_word_embedding(word_embedding, self.vocab_set)

        return ComputeCCA(self.vsm_matrix, self.oracle_matrix)

    def _read_vector_matrix_from_word_embedding(self, word_embedding, vocab_set):
        """
        Reads vector values from word embedding.
        :param word_embedding: {word -> [val_dim1, val_dim2, ..., val_dimn]}. Words have to appear in vocabulary as defined
        :param vocab_set:
        :return: List of word vectors, alphabetically sorted by words in vocabulary set.
        """

        # Filter out columns not in vocabulary set, sort by words ascendingly.
        filtered_sorted_word_embedding = word_embedding[
            word_embedding.index.isin(vocab_set)
        ].sort_index(ascending=True)

        # QVEC-CCA requests vector data to be a numpy array of lists, hence a cast (from ndarray of ndarrays) is
        # necessary.
        casted_word_vectors = numpy.asarray(
            [word_vector_ndarray.tolist() for word_vector_ndarray in filtered_sorted_word_embedding['values']]
        )

        return numpy.asarray(casted_word_vectors)
