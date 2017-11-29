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
        # 2. Generate dict object for BO.initialize from t-SNE metadata.
        # 3. Call BO.maximize.
        # 4. Persist all t-SNE models (has to be done in function to maximize).
