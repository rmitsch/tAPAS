from MulticoreTSNE import MulticoreTSNE as MulticoreTSNE
import numpy


class TSNEModel:
    """
    Representation of t-SNE model including configuration and actual data.
    """

    # Define possible values for categorical variables.
    CATEGORICAL_VALUES = {
        'metrics': ["braycurtis", "canberra", "chebyshev", "cityblock", "correlation", "cosine",
                    "dice", "euclidean", "hamming", "jaccard", "kulsinski", "mahalanobis",
                    "matching", "minkowski", "rogerstanimoto", "russellrao", "seuclidean",
                    "sokalmichener", "sokalsneath", "sqeuclidean", "yule"],
        'init_methods': ["random", "PCA"]
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
                 init_method,
                 measure_weight_trustworthiness,
                 measure_weight_continuity,
                 measure_weight_generalization,
                 measure_weight_relative_weq):
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
        :param measure_weight_trustworthiness:
        :param measure_weight_continuity:
        :param measure_weight_generalization:
        :param measure_weight_relative_weq:
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
        self.measure_weight_trustworthiness = measure_weight_trustworthiness
        self.measure_weight_continuity = measure_weight_continuity
        self.measure_weight_generalization = measure_weight_generalization
        self.measure_weight_relative_weq = measure_weight_relative_weq
        self.tsne_model = None

    def run(self, word_embedding):
        """
        Runs t-SNE model with specified parameters and data. Returns result.
        :param word_embedding: Word embedding; expected to be only as long as self.num_words.
        :return:
        """
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

        # Train TSNE on gensim's model, return results.
        return tsne.fit_transform(word_vector_data)

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
            init_method=param_dict["initMethod"],
            measure_weight_trustworthiness=param_dict["measureWeight_trustworthiness"],
            measure_weight_continuity=param_dict["measureWeight_continuity"],
            measure_weight_generalization=param_dict["measureWeight_generalization"],
            measure_weight_relative_weq=param_dict["measureWeight_relativeWEQ"]
        )
