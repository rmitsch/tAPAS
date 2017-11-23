import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
from backend.algorithm.QVEC import QVECConfiguration
import numpy
import pydpc
import matplotlib as mpl
import matplotlib.pyplot as plt
import pickle


db_connector = Utils.connect_to_database(False)

word_embedding = db_connector.read_word_vectors_for_dataset("wiki_small.en.vec")
word_embedding_small = word_embedding.head(n=100)

data = numpy.stack(word_embedding['values'].values, axis=0)




# word_embedding_small.at["school", "id"] = 3
# print(word_embedding_small)
# print(word_embedding_small.groupby(['id']).count().max()["values"])
# exit()

# 0.2  |  2000  |  2.5 :  7606  - max.:  630
# 0.2  |  3000  |  2.5 :  3031  - max.:  1469
# 0.2  |  4000  |  2.5 :  43  - max.:  8804
# 0.2  |  5000  |  2.5 :  0  - max.:  9998
# 0.2  |  1000  |  2 :  9413  - max.:  111
# 0.2  |  1000  |  3 :  6667  - max.:  1653
# 0.2  |  1000  |  4 :  2086  - max.:  6808
# 0.2  |  1000  |  5 :  214  - max.:  9666

# 0.2  |  100  |  2 :  9577  - max.:  111
# 0.2  |  100  |  3 :  6824  - max.:  1651
# 0.2  |  100  |  4 :  2226  - max.:  6771
# 0.2  |  100  |  5 :  334  - max.:  9527

# 0.2  |  1500  |  2 :  9217  - max.:  117
# 0.2  |  1500  |  3 :  6479  - max.:  1674
# 0.2  |  1500  |  4 :  1926  - max.:  6930
# 0.2  |  1500  |  5 :  128  - max.:  9810
# 0.2  |  2000  |  2 :  8574  - max.:  140
# 0.2  |  2000  |  3 :  5880  - max.:  1787
# 0.2  |  2000  |  4 :  1528  - max.:  7246
# 0.2  |  2000  |  5 :  12  - max.:  9984

results = {}
for fraction in [0.01, 0.1, 0.4]:
    results[fraction] = {}
    for rho in [10, 100, 1000, 2000]:
        results[fraction][rho] = {}
        for delta in [0.1, 3, 5]:
            clu = pydpc.Cluster(data, fraction=fraction)
            # rho, delta
            clu.assign(rho, delta)

            membership_counts = {}
            memberships = {}
            for index, cluster_membership in enumerate(clu.membership):
                if cluster_membership in membership_counts:
                    membership_counts[cluster_membership] += 1
                    memberships[cluster_membership].append(index)
                else:
                    membership_counts[cluster_membership] = 1
                    memberships[cluster_membership] = []
                    memberships[cluster_membership].append(index)

            word_embedding["cluster_id"] = clu.membership
            print(fraction, " | ", rho, " | ", delta, ": ", clu.nclusters)

            var = numpy.var(numpy.array(sorted(list(membership_counts.values()), reverse=True)))
            results[fraction][rho][delta] = var
            print(fraction, ",", rho, ",", delta, ",", var)

