import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
from backend.algorithm.TSNEModel import TSNEModel
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
from flask import jsonify
import pandas
import sobol_seq
import multiprocessing

db_connector = Utils.connect_to_database(False)


# db_connector.read_metadata_for_run(run_title="completerun")


tsne_model_id = 37
word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec").head(5000)
tsne_results = db_connector.read_tsne_results(tsne_model_id=tsne_model_id)
# word_embedding_small = word_embedding.head(n=1000)
#
stacked_wordvectors = numpy.stack(word_embedding['values'].values, axis=0)


# print(numpy.sum(bla[0]))



# blab = BayesianTSNEOptimizer(db_connector=db_connector, run_name="run10", word_embedding=word_embedding_small)
# blab.run(num_iterations=5, kappa=4)

# blub = [[3, 3], [2, 5]]
# print(numpy.array(blub))
# print(pandas.DataFrame(numpy.array(blub)).to_json(orient="index"))

# coranking_matrix = None
#
# # 2. Calculate coranking matrix.
# word_embedding_vector_array = numpy.stack(word_embedding["values"].values, axis=0)
# tsne_model_vector_array = numpy.stack(tsne_results["values"].values, axis=0)
# coranking_matrix = coranking.coranking_matrix(word_embedding_vector_array, tsne_model_vector_array)
# cont = None
# trust = None
#
#
# def calc_continuity():
#     global coranking_matrix
#     global cont
#     cont = continuity(coranking_matrix.astype(numpy.float16), min_k=1, max_k=100)
#
#
# def calc_trustworthiness():
#     global coranking_matrix
#     global trust
#     trust = trustworthiness(coranking_matrix.astype(numpy.float16), min_k=1, max_k=100)
#
#
# # 3. Calculate continuity.
# cont_process = multiprocessing.Process(target=calc_continuity(), args=())
# # 4. Calculate trustworthiness.
# trust_process = multiprocessing.Process(target=calc_trustworthiness(), args=())
# cont_process.start()
# trust_process.start()
# cont_process.join()
# trust_process.join()
#
# print(trust, cont)
#
# fig, ax = plt.subplots()
# rects1 = plt.bar(numpy.arange(len(trust)),  trust, 0.35, color='r', label="trust")
# rects2 = plt.bar(numpy.arange(len(cont)) + 0.35, cont, 0.35, color='b', label="cont")
# plt.legend()
# plt.show()

qm = TSNEModel.calculate_quality_measures(word_embedding, tsne_results)

db_connector.set_tsne_quality_scores(
                trustworthiness=qm["trustworthiness"],
                continuity=qm["continuity"],
                generalization_accuracy=qm["generalization_accuracy"],
                qvec_score=qm["qvec"],
                tsne_id=tsne_model_id
            )

