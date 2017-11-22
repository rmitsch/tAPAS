import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
from backend.algorithm.QVEC import QVECConfiguration

db_connector = Utils.connect_to_database(False)

word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec")
qvec = QVECConfiguration()
print("result = ", qvec.run(word_embedding=word_embedding))
