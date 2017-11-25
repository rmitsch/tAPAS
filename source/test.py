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
import coranking
from coranking.metrics import trustworthiness, continuity


db_connector = Utils.connect_to_database(False)

word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec")
word_embedding_small = word_embedding.head(n=1000)

stacked_wordvectors = numpy.stack(word_embedding['values'].values, axis=0)


# 1. Load t-SNE results.
tsne_results = db_connector.read_tsne_results(tsne_model_id=42)

limited_word_embedding_vector_array = numpy.stack(word_embedding_small["values"].values, axis=0)
tsne_model_vector_array = numpy.stack(tsne_results["values"].values, axis=0)

coranking_matrix = coranking.coranking_matrix(limited_word_embedding_vector_array, tsne_model_vector_array)

# 4. Calculate trustworthiness.
trust = trustworthiness(coranking_matrix.astype(numpy.float16), min_k=99, max_k=100)

# 5. Calculate continuity.
cont = continuity(coranking_matrix.astype(numpy.float16), min_k=99, max_k=100)

print(trust, cont)