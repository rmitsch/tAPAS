from MulticoreTSNE import MulticoreTSNE as MulticoreTSNE
import numpy
from .WordEmbeddingClusterer import WordEmbeddingClusterer
from backend.algorithm.QVEC import QVECConfiguration
import coranking
from coranking.metrics import trustworthiness, continuity
import sklearn.neighbors


class TSNEModel:
    """
    Representation of t-SNE model including configuration and actual data.
    """

    # Define possible values for categorical variables.
    CATEGORICAL_VALUES = {
        'metric': ["braycurtis", "canberra", "chebyshev", "cityblock", "correlation", "cosine",
                    "dice", "euclidean", "hamming", "jaccard", "kulsinski", "mahalanobis",
                    "matching", "minkowski", "rogerstanimoto", "russellrao", "seuclidean",
                    "sokalmichener", "sokalsneath", "sqeuclidean", "yule"],
        'init_method': ["random", "PCA"]
    }

    # Define column names containing information whether parameter is fixed or not.
    ISFIXED_COLUMN_NAMES = ["is_n_components_fixed", "is_perplexity_fixed", "is_early_exaggeration_fixed",
                            "is_learning_rate_fixed", "is_n_iter_fixed", "is_min_grad_norm_fixed",
                            "is_metric_fixed", "is_init_method_fixed", "is_random_state_fixed",
                            "is_angle_fixed"]

    # Hardcode thresholds for parameter values. Categorical values are represented by indices.
    PARAMETER_RANGES = {
        "n_components": (1, 5),
        "perplexity": (1, 100),
        "early_exaggeration": (1, 50),
        "learning_rate": (1, 2000),
        "n_iter": (1, 10000),
        "min_grad_norm": (0.0000000001, 0.1),
        "metric": (0, 20),
        "init_method": (0, 1),
        "random_state": (1, 100),
        "angle": (0.1, 1)
    }

    def __init__(self,
                 num_words,
                 num_dimensions,
                 perplexity,
                 early_exaggeration,
                 learning_rate,
                 num_iterations,
                 min_grad_norm,
                 random_state,
                 angle,
                 metric,
                 init_method):
        """
        :param num_words:
        :param num_dimensions:
        :param perplexity:
        :param early_exaggeration:
        :param learning_rate:
        :param num_iterations:
        :param min_grad_norm:
        :param random_state:
        :param angle:
        :param metric:
        :param init_method:
        """

        self.num_words = num_words
        self.num_dimensions = num_dimensions
        self.perplexity = perplexity
        self.early_exaggeration = early_exaggeration
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.min_grad_norm = min_grad_norm
        self.random_state = random_state
        self.angle = angle
        self.metric = metric
        self.init_method = init_method

        self.tsne_results = None
        self.word_embedding = None

    def run(self, word_embedding):
        """
        Runs t-SNE model with specified parameters and data. Returns result.
        :param word_embedding: Word embedding; expected to be only as long as self.num_words.
        :return:
        """
        self.word_embedding = word_embedding
        word_vector_data = numpy.stack(word_embedding['values'].values, axis=0)

        # Consider num_words!
        tsne = MulticoreTSNE(
            n_components=self.num_dimensions,
            perplexity=self.perplexity,
            early_exaggeration=self.early_exaggeration,
            learning_rate=self.learning_rate,
            n_iter=self.num_iterations,
            min_grad_norm=self.min_grad_norm,
            random_state=self.random_state,
            angle=self.angle,
            metric=self.metric,
            init=self.init_method,
            n_jobs=2)

        # Train TSNE on gensim's model.
        self.tsne_results = tsne.fit_transform(word_vector_data)

        return self.tsne_results

    @staticmethod
    def generate_instance_from_dict(param_dict):
        """
        Generates TSNEModel from dictionary.
        :param param_dict:
        :return: TSNEModel instance.
        """

        return TSNEModel(
            num_words=param_dict["numWords"],
            num_dimensions=param_dict["numDimensions"],
            perplexity=param_dict["perplexity"],
            early_exaggeration=param_dict["earlyExaggeration"],
            learning_rate=param_dict["learningRate"],
            num_iterations=param_dict["numIterations"],
            min_grad_norm=param_dict["minGradNorm"],
            random_state=param_dict["randomState"],
            angle=param_dict["angle"],
            metric=param_dict["metric"],
            init_method=param_dict["initMethod"]
        )


    @staticmethod
    def generate_instance_from_dict_with_db_names(param_dict):
        """
        Generates TSNEModel from dictionary.
        :param param_dict:
        :return: TSNEModel instance.
        """

        return TSNEModel(
            num_words=param_dict["num_words"],
            num_dimensions=param_dict["n_components"],
            perplexity=param_dict["perplexity"],
            early_exaggeration=param_dict["early_exaggeration"],
            learning_rate=param_dict["learning_rate"],
            num_iterations=param_dict["n_iter"],
            min_grad_norm=param_dict["min_grad_norm"],
            random_state=param_dict["random_state"],
            angle=param_dict["angle"],
            metric=param_dict["metric"],
            init_method=param_dict["init_method"]
        )

    @staticmethod
    def calculate_quality_measures(word_embedding, tsne_results):
        """
        Calculates quality measures for specified t-SNE result data.
        :param word_embedding:
        :param tsne_results:
        :return:
        """

        # 1. Calculate QVEC score.
        qvec_score = QVECConfiguration().run(word_embedding=tsne_results)

        # 2. Calculate coranking matrix.
        word_embedding_vector_array = numpy.stack(word_embedding["values"].values, axis=0)
        tsne_model_vector_array = numpy.stack(tsne_results["values"].values, axis=0)
        coranking_matrix = coranking.coranking_matrix(word_embedding_vector_array, tsne_model_vector_array)

        # 3. Calculate trustworthiness.
        trust = trustworthiness(coranking_matrix.astype(numpy.float16), min_k=99, max_k=100)

        # 4. Calculate continuity.
        cont = continuity(coranking_matrix.astype(numpy.float16), min_k=99, max_k=100)

        # 5. Calculate generalization accuracy.
        # Use nearest neighbour search with ball tree to find nearest neighbour in t-SNE vector space.
        neighbours = sklearn.neighbors.NearestNeighbors(n_neighbors=2, algorithm='ball_tree').fit(
            tsne_model_vector_array)
        distances, indices = neighbours.kneighbors(tsne_model_vector_array)
        # Classify points using the cluster ID's of their nearest neighbours, compare with their actual cluster ID to
        # calculate generalization accuracy.
        predicted_cluster_values = word_embedding.iloc[indices[:, 1]]["cluster_id"].values
        actual_cluster_values = word_embedding["cluster_id"].values
        generalization_accuracy = \
            numpy.sum(predicted_cluster_values == actual_cluster_values) / len(actual_cluster_values)

        return {
            "qvec": qvec_score,
            "trustworthiness": float(trust[0]),
            "continuity": float(cont[0]),
            "generalization_accuracy": generalization_accuracy
        }

    def persist(self, db_connector, run_name):
        """
        Stores t-SNE model in DB.
        :param db_connector:
        :param run_name:
        :return: DB ID of t-SNE model.
        """

        # Copy fields and assign new names to avoid column name conflict. Fix when time available.
        parameters = vars(self)
        parameters["numDimensions"] = self.num_dimensions,
        parameters["earlyExaggeration"] = self.early_exaggeration,
        parameters["learningRate"] = self.learning_rate,
        parameters["numIterations"] = self.num_iterations,
        parameters["minGradNorm"] = self.min_grad_norm
        parameters["initMethod"] = self.init_method
        parameters["randomState"] = self.random_state
        parameters["runName"] = run_name

        # Insert metadata for initial t-SNE model.
        tsne_model_id = db_connector.insert_tsne_model(tsne_configuration=parameters)

        # If t-SNE model doesn't exist yet: Generate, persist.
        if tsne_model_id != -1:
            # Calculate and persist initial, clustered t-SNE model.
            db_connector.insert_tsne_coordinates(
                tsne_model_id=tsne_model_id,
                word_ids=self.word_embedding['id'].values,
                cluster_ids=WordEmbeddingClusterer(self.tsne_results).run(),
                tsne_result=self.tsne_results
            )

        return tsne_model_id
