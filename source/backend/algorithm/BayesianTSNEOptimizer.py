from bayes_opt import BayesianOptimization
from .TSNEModel import TSNEModel


class BayesianTSNEOptimizer:
    """
    Wrapper class for Bayesian optmization of t-SNE models.
    """

    def __init__(self, db_connector, run_name):
        """
        Initializes BO for t-SNE.
        :param db_connector:
        :param run_name:
        """
        self.db_connector = db_connector
        self.run_name = run_name
        # Define dictionary holding fixed parameters.
        self.fixed_parameters = None
        # Define dictionary holding variable parameters.
        self.variable_parameters = None

        self.fixed_parameters = {}
        self.fixed_parameters["z"] = 3

    def run(self, num_iterations):
        """
        Fetches latest t-SNE model from DB. Collects pickled BO status object, if existent.
        Intermediate t-SNE models are persisted.
        :param num_iterations: Number of iterations BO should run.
        :return:
        """

        # 1. Load all previous t-SNE parameters and results (read_metadata_for_run). Consider which params are
        #    fixed though! Put only dynamic ones in dict. for BO, static ones should be made available via class
        #    attribute.
        run_metadata = self.db_connector.read_metadata_for_run(self.run_name)

        # 2. Generate dict object for BO.initialize from t-SNE metadata.

        bo = BayesianOptimization(self.calculate_tSNE_quality, {'x': (-4, 4), 'y': (-3, 3)})
        bo.maximize(init_points=5, n_iter=5, kappa=2, acq='ucb')
        print(bo.res)

            # 3. Call BO.maximize.
        # 4. Persist all t-SNE models (has to be done in function to maximize).#

    def calculate_tSNE_quality(self, **kwargs):
        """
        Optimization target. Wrapper for generating t-SNE models.
        :param kwargs: Dictionary holding some of the following data points for this run in general and its historical
        t-SNE results (tm.X denotes a t-SNE model's property, r.X a run's property):
            tm.n_components,
            tm.perplexity,
            tm.early_exaggeration,
            tm.learning_rate,
            tm.n_iter,
            tm.min_grad_norm,
            tm.metric,
            tm.init_method,
            tm.random_state,
            tm.angle,
            tm.measure_trustworthiness,
            tm.measure_continuity,
            tm.measure_generalization_accuracy,
            tm.measure_word_embedding_information_ratio,
            tm.measure_user_quality
        A union of the dynamic parameters specified by BO and the static, user-defined ones has to yield a dictionary
        containing all of the above parameters.
        :return:
        """
        new_x = {}
        # set params we are checking right now
        new_x.update(kwargs)

        return new_x["x"] + new_x["y"] * self.fixed_parameters["z"]
