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
from bayes_opt import BayesianOptimization
from backend.algorithm.BayesianTSNEOptimizer import BayesianTSNEOptimizer

db_connector = Utils.connect_to_database(False)


db_connector.read_metadata_for_run(run_title="completerun")

word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec")
word_embedding_small = word_embedding.head(n=1000)
#
# stacked_wordvectors = numpy.stack(word_embedding['values'].values, axis=0)


# # 1. Load t-SNE results.
# tsne_results = db_connector.read_tsne_results(tsne_model_id=42)
#
# limited_word_embedding_vector_array = numpy.stack(word_embedding_small["values"].values, axis=0)
# tsne_model_vector_array = numpy.stack(tsne_results["values"].values, axis=0)
#
# coranking_matrix = coranking.coranking_matrix(limited_word_embedding_vector_array, tsne_model_vector_array)
#
# # 4. Calculate trustworthiness.
# trust = trustworthiness(coranking_matrix.astype(numpy.float16), min_k=99, max_k=100)
#
# # 5. Calculate continuity.
# cont = continuity(coranking_matrix.astype(numpy.float16), min_k=99, max_k=100)
#
# print(trust, cont)

# https://github.com/fmfn/BayesianOptimization/issues/35
# fixed_params = {}
# fixed_params["z"] = 3
#
# def test(**kwargs):
#     new_x = {}
#     # set params we are checking right now
#     new_x.update(kwargs)
#
#     return new_x["x"] + new_x["y"] * fixed_params["z"]
#
# try:
#     bo = BayesianOptimization(test, {'x': (-4, 4), 'y': (-3, 3)})
#     bo.maximize(init_points=5, n_iter=5, kappa=2, acq='ucb')
#     print(bo.res)
# except UserWarning:
#     print("Warning")


blab = BayesianTSNEOptimizer(db_connector=db_connector, run_name="run10", word_embedding=word_embedding_small)
blab.run(num_iterations=5, kappa=4)
