class TSNEModel:
    """
    Representation of t-SNE model including configuration and actual data.
    """

    def __init__(self,
                 dataset_name,
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

        :param dataset_name:
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

        self.dataset_name = dataset_name
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

        print(', '.join("%s: %s" % item for item in vars(self).items()))

    @staticmethod
    def generate_instance_from_json_dict(param_dict):
        """
        Generates TSNEModel from json dictionary.
        :param param_dict:
        :return: TSNEModel instance.
        """

        return TSNEModel(
            dataset_name=param_dict["dataset"],
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
