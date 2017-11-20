from .QVEC import GetVocab
from .QVEC import ReadOracleMatrix
from .QVEC import ComputeCCA
import numpy


class QVECConfiguration:
    """
    Wrapper for QVEC algorithm for easier use.
    """

    def __init__(self, oracle_filenames):
        self.oracle_files = oracle_filenames.strip().split(",")
        self.vocab_oracle = GetVocab(self.oracle_files, vocab_union=True)
        self.vocab_vectors = None
        self.vocab_set = None
        self.oracle_matrix = None
        self.vsm_matrix = None

    def evaluate_word_embedding(self, word_embedding):
        """
        Calculates QVEC-CCA score for specified word embedding.
        Overwrites previous values for word embedding-specific variables (as opposed to the oracle-related data).
        :return:
        """

        self.vocab_vectors = self.get_vocab_from_word_embedding(word_embedding)
        self.vocab_set = set(self.vocab_vectors) & set(self.vocab_oracle)

        self.oracle_matrix = ReadOracleMatrix(self.oracle_files, self.vocab_set)
        self.vsm_matrix = self.read_vector_matrix_from_word_embedding(word_embedding, self.vocab_set)

        return ComputeCCA(self.vsm_matrix, self.oracle_matrix)

    def get_vocab_from_word_embedding(self, word_embedding):
        """
        Extracts vocabulary from word embedding.
        :param word_embedding: Data frame with n + 1 columns, where n == 0 contains the word and all other columns
        contain this word's vector columns.
        :return: Vocabulary as extracted from the word embedding as set.
        """

        # Assuming there aren't any charset problems.
        return word_embedding.iloc[:, 0]

    def read_vector_matrix_from_word_embedding(self, word_embedding):
        """
        Reads vector values from word embedding.
        :param word_embedding: {word -> [val_dim1, val_dim2, ..., val_dimn]}. Words have to appear in vocabulary as defined
        :return: List of word vectors, alphabetically sorted by words in vocabulary set.
        """

        # Filter out columns not in vocabulary set, sort by words ascendingly.
        filtered_word_vectors = word_embedding[
            word_embedding.columns[0].isin(self.vocab_set)
        ].sort(word_embedding.columns[0], ascending=True).iloc[:, 1:].values()

        return filtered_word_vectors
