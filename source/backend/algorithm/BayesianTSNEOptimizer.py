from bayes_opt import BayesianOptimization
from .TSNEModel import TSNEModel
import pandas


class BayesianTSNEOptimizer:
    """
    Wrapper class for Bayesian optmization of t-SNE models.
    """

    # Define column names containing information whether parameter is fixed or not.
    ISFIXED_COLUMN_NAMES = ["is_n_components_fixed", "is_perplexity_fixed", "is_early_exaggeration_fixed",
                            "is_learning_rate_fixed", "is_n_iter_fixed", "is_min_grad_norm_fixed",
                            "is_metric_fixed", "is_init_method_fixed", "is_random_state_fixed",
                            "is_angle_fixed"]

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

    def run(self, num_iterations, kappa):
        """
        Fetches latest t-SNE model from DB. Collects pickled BO status object, if existent.
        Intermediate t-SNE models are persisted.
        :param num_iterations: Number of iterations BO should run.
        :param kappa:
        :return:
        """

        # 1. Load all previous t-SNE parameters and results (read_metadata_for_run). Consider which params are
        #    fixed though! Put only dynamic ones in dict. for BO, static ones should be made available via class
        #    attribute.
        run_metadata = self.db_connector.read_metadata_for_run(self.run_name)

        # Set fixed parameters.
        self.fixed_parameters = self._update_parameter_dictionary(run_iter_metadata=run_metadata[0], is_fixed=True)
        self.variable_parameters = self._update_parameter_dictionary(run_iter_metadata=run_metadata[0], is_fixed=False)

        # 2. Generate dict object for BO.initialize from t-SNE metadata.
        initialization_dataframe = pandas.DataFrame.from_dict(run_metadata)
        # Drop non-hyperparameter columns.
        initialization_dataframe.drop(BayesianTSNEOptimizer.ISFIXED_COLUMN_NAMES, inplace=True, axis=1)

        # Create initialization dictionary.
        initialization_dict = {
            column_name[3:-6]: initialization_dataframe[column_name[3:-6]].values.tolist()
            for column_name in BayesianTSNEOptimizer.ISFIXED_COLUMN_NAMES
        }
        # Add target values (model quality) to initialization dictionary.
        initialization_dict["target"] = initialization_dataframe["measure_user_quality"].values.tolist()

        # 3. Create BO object.
        # Hardcode thresholds for parameter values. Categorical values are represented by indices.
        parameter_ranges = {
            "n_components": (1, 5),
            "perplexity": (1, 100),
            "early_exaggeration": (1, 50),
            "learning_rate": (1, 5000),
            "n_iter": (1, 10000),
            "min_grad_norm": (1e-10, 1e-1),
            "metric": (1, 21),
            "init_method": (1, 2),
            "random_state": (1, 100),
            "angle": (0.1, 1)
        }

        # Drop all fixed parameters' ranges and entries in initialization dictionary.
        for key in self.fixed_parameters:
            if self.fixed_parameters[key] is not None:
                del parameter_ranges[key]
                del initialization_dict[key]

        # Create optimization object.
        bo = BayesianOptimization(self._calculate_tsne_quality, parameter_ranges)

        # Pass previous results to BO instance.
        bo.initialize(initialization_dict)

        # 4. Execute optimization.
        bo.maximize(init_points=1, n_iter=num_iterations, kappa=kappa);


    def _update_parameter_dictionary(self, run_iter_metadata, is_fixed):
        """
        Sets attributes in parameter dictionary.
        :param run_iter_metadata:
        :param is_fixed:
        :return: Dictionary with (non-)fixed parameters.
        """
        # Add only arguments with the correct fixed value to dictionary.
        parameter_dictionary = {
            column_name[3:-6]: run_iter_metadata[column_name[3:-6]]
            if run_iter_metadata[column_name] is is_fixed else None
            for column_name in BayesianTSNEOptimizer.ISFIXED_COLUMN_NAMES
        }

        return parameter_dictionary

    def _calculate_tsne_quality(self, **kwargs):
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
            tm.measure_continuYity,
            tm.measure_generalization_accuracy,
            tm.measure_word_embedding_information_ratio,
            tm.measure_user_quality
        A union of the dynamic parameters specified by BO and the static, user-defined ones has to yield a dictionary
        containing all of the above parameters.
        :return:
        """
        # Fetch parameters defined by BO.
        parameters = {}
        parameters.update(kwargs)

        # 1. Prepare parameter set.

        # If categorical attributes are to be varied: Translate floating point value specified by BO to category string
        # accepted by sklearn's t-SNE.
        for key in parameters:
            if key in ["metric", "init_method"]:
                parameters[key] = TSNEModel.CATEGORICAL_VALUES[key][int(parameters["init_method"])]

        # Add missing (fixed) parameters.
        for key in self.fixed_parameters:
            if key not in parameters:
                parameters[key] = self.fixed_parameters[key]

        # 2. Calculate t-SNE model.

        # 3. Persist t-SNE model.

        # 4. Calculate t-SNE model's quality and update database records.

        # 5. Return model score.
        return \
            parameters["angle"] *  parameters["n_components"]
