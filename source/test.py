import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
from backend.algorithm.QVEC import QVECConfiguration
import numpy
import pydpc


db_connector = Utils.connect_to_database(False)

word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec")


data = numpy.stack(word_embedding['values'].values, axis=0)
clu = pydpc.Cluster(data)
clu.assign(5, 1.5)
print(clu.nclusters)
