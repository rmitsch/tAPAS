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

db_connector = Utils.connect_to_database(False)


# db_connector.read_metadata_for_run(run_title="completerun")


tsne_model_id = 13
word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec").head(5000)
tsne_results = db_connector.read_tsne_results(tsne_model_id=tsne_model_id)
# word_embedding_small = word_embedding.head(n=1000)
#
# stacked_wordvectors = numpy.stack(word_embedding['values'].values, axis=0)




# blab = BayesianTSNEOptimizer(db_connector=db_connector, run_name="run10", word_embedding=word_embedding_small)
# blab.run(num_iterations=5, kappa=4)

# blub = [[3, 3], [2, 5]]
# print(numpy.array(blub))
# print(pandas.DataFrame(numpy.array(blub)).to_json(orient="index"))

# First 10 Sobol-sets for 10 dimensions.
# num_dim = 10
# num_iter = 10
# parameter_sets = []
# sobol_numbers = sobol_seq.i4_sobol_generate(num_dim, num_iter)
#
# for curr_iter in range(0, num_iter):
#     parameter_set = {}
#
#     for param_entry, sobol_number in zip(TSNEModel.PARAMETER_RANGES.items(), sobol_numbers[curr_iter]):
#         param = param_entry[0]
#         param_range = param_entry[1]
#
#         # Categorical values.
#         if param in ("init_method", "metric"):
#             index = param_range[0] + round((param_range[1] - param_range[0]) * sobol_number)
#             parameter_set[param] = TSNEModel.CATEGORICAL_VALUES[param][int(index)]
#
#         # Numerical values.
#         else:
#             # Integer values.
#             if param in ["n_components", "random_state", "n_iter"]:
#                 parameter_set[param] = param_range[0] + round((param_range[1] - param_range[0]) * sobol_number)
#             # Float values.
#             else:
#                 parameter_set[param] = param_range[0] + (param_range[1] - param_range[0]) * sobol_number
#     parameter_sets.append(parameter_set)


quality_measures = TSNEModel.calculate_quality_measures(
                word_embedding=word_embedding,
                tsne_results=db_connector.read_tsne_results(tsne_model_id=tsne_model_id)
            )

db_connector.set_tsne_quality_scores(
                trustworthiness=quality_measures["trustworthiness"],
                continuity=quality_measures["continuity"],
                generalization_accuracy=quality_measures["generalization_accuracy"],
                qvec_score=quality_measures["qvec"],
                tsne_id=tsne_model_id
            )