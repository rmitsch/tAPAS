# @author RM
# @date 2017-08-08
# Class for connecting to database. Uses exactly one connection.
#

import psycopg2
import sys
import logging
import numpy
import json
import pandas


class DBConnector:
    """
    Class for connecting to postgres database and executing queries.
    """

    def __init__(self, host, database, port, user, password):
        """
        Init instance of DBConnector.
        :param host:
        :param database:
        :param port:
        :param user:
        :param password:
        """
        self.logger = logging.getLogger("topac")

        try:
            # Init DB connection.
            self.connection = psycopg2.connect(host=host, database=database, port=port, user=user, password=password)
        except psycopg2.Error:
            self.logger.critical("Connection to database failed. Check parameters.")

    def construct_database(self, path="backend/database/ddl", reconstruct=False):
        """
        Execute DDL. Note: Does not reconstruct database by default if it already exists.
        :param path: Path to DDL file.
        :param reconstruct: Specifies whether DB should be reconstructed if it already exists (note that persisted data
        will be lost.
        :return:
        """
        # Create cursor.
        cursor = self.connection.cursor()
        # Execute ddl.sql.
        try:
            # Does schema exist? Assume database exists already since configured that way in docker-compose.
            cursor.execute("select exists(select schema_name from information_schema.schemata where schema_name = "
                           "'tapas')")
            res = cursor.fetchone()

            # If DB is to be reconstructed or does not exist yet: Execute DDL. Otherwise do nothing.
            if res[0] is False or reconstruct is True:
                # Drop schema if it exists.
                cursor.execute("drop schema if exists tapas cascade")
                # Construct database.
                cursor.execute(open(path, "r").read())
                self.connection.commit()

        except psycopg2.Error:
            print(sys.exc_info()[1])

    def import_dataset(self, dataset_name, n_dim):
        """
        Imports new entry in table datasets.
        :param dataset_name:
        :param n_dim:
        :return: Dataset ID.
        """
        cursor = self.connection.cursor()

        # Check if dataset with this name already exists.
        cursor.execute("select "
                       "    id "
                       "from "
                       "    tapas.datasets "
                       "where "
                       "    name = %s",
                       (dataset_name,))
        res = cursor.fetchone()
        dataset_id = res[0] if res is not None else -1

        # If dataset doesn't exist yet: Add new record.
        if dataset_id == -1:
            cursor.execute("insert into "
                           "    tapas.datasets("
                           "        name, n_dim"
                           ") "
                           "values (%s, %s) "
                           "returning id",
                           (dataset_name, n_dim))
            self.connection.commit()

            return cursor.fetchone()[0]
        # Otherwise: Return ID of existing dataset.
        else:
            return dataset_id

    def import_word_vectors(self, tuples_to_insert):
        """
        Import word vectors into database.
        :param tuples_to_insert: (word, vector, dataset ID)
        :return:
        """
        cursor = self.connection.cursor()

        # 1. Drop foreign key constraint to dataset before import.
        cursor.execute("ALTER TABLE tapas.word_vectors DROP CONSTRAINT IF EXISTS word_vectors_datasets")

        # 2. Write word vectors to DB.
        cursor.execute(cursor.mogrify("insert into "
                                      "     tapas.word_vectors ("
                                      "         word, "
                                      "         values, "
                                      "         datasets_id) "
                                      " values " +
                                      ','.join(["%s"] * len(tuples_to_insert)), tuples_to_insert))

        # 3. Reintroduce foreign key constraint.
        cursor.execute("ALTER TABLE tapas.word_vectors ADD CONSTRAINT word_vectors_datasets "
                       "FOREIGN KEY (datasets_id) "
                       "REFERENCES tapas.datasets (id) "
                       "NOT DEFERRABLE INITIALLY IMMEDIATE")

        # 4. Commit changes.
        self.connection.commit()

    def read_dataset_word_counts(self):
        """
        Reads names of all datasets in DB.
        :return: List of dataset names.
        """
        cursor = self.connection.cursor()

        cursor.execute("select "
                       "   row_to_json(t) "
                       " from ( "
                       "   select "
                       "     d.name, "
                       "     count(wv.id) as wv_count "
                       "   from "
                       "     tapas.datasets d "
                       "   inner join tapas.word_vectors wv on "
                       "     wv.datasets_id = d.id "
                       "   group by "
                       "     d.name "
                       " ) t;")

        return [row[0] for row in cursor.fetchall()]

    def read_first_run_metadata(self):
        """
        Reads metadata for all first runs in database.
        Used in view "Generate new run".
        :return:
        """
        cursor = self.connection.cursor()

        cursor.execute("""
            select
             row_to_json(t)
           from (
             select
              d.name as dataset,
              r.title,
              r.measure_weight_trustworthiness as measureWeight_trustworthiness,
              r.measure_weight_continuity as measureWeight_continuity,
              r.measure_weight_generalization_accuracy as measureWeight_generalization,
              r.measure_weight_we_information_ratio as measureWeight_relativeWEQ,
              r.init_n_components as numDimensions,
              r.init_perplexity as perplexity,
              r.init_early_exaggeration as earlyExaggeration,
              r.init_learning_rate as learningRate,
              r.init_n_iter as numIterations,
              r.init_min_grad_norm as minGradNorm,
              r.init_metric as metric,
              r.init_init_method as initMethod,
              r.init_random_state as randomState,
              r.init_angle as angle,
              r.num_words as numWords,
              count(distinct wv.id) as dataset_numWords
            from
              tapas.datasets d
            inner join tapas.runs r on
              r.datasets_id = d.id
            inner join tapas.word_vectors wv on
              wv.datasets_id = d.id
             group by
              d.name,
              r.title,
              r.measure_weight_trustworthiness,
              r.measure_weight_continuity,
              r.measure_weight_generalization_accuracy,
              r.measure_weight_we_information_ratio,
              r.init_n_components,
              r.init_perplexity,
              r.init_early_exaggeration,
              r.init_learning_rate,
              r.init_n_iter,
              r.init_min_grad_norm,
              r.init_metric,
              r.init_init_method,
              r.init_random_state,
              r.init_angle,
              r.num_words
           ) t
        """)
        res = cursor.fetchall()

        return [row[0] for row in res]

    def insert_new_run(self, run_config):
        """
        Inserts new run as specified by run configuration.
        :return:
        """
        cursor = self.connection.cursor()

        try:
            # Check if dataset with this name already exists.
            cursor.execute("select "
                           "    id "
                           "from "
                           "    tapas.datasets "
                           "where "
                           "    name = %s",
                           (run_config["dataset"],))
            dataset_id = cursor.fetchone()[0]

            cursor.execute("insert into tapas.runs ( "
                           "    title, "
                           "    description, "
                           "    measure_weight_trustworthiness, "
                           "    measure_weight_continuity, "
                           "    measure_weight_generalization_accuracy, "
                           "    measure_weight_we_information_ratio, "
                           "    datasets_id, "
                           "    num_words, "
                           "    init_n_components, "
                           "    init_perplexity, "
                           "    init_early_exaggeration, "
                           "    init_learning_rate, "
                           "    init_n_iter, "
                           "    init_min_grad_norm, "
                           "    init_metric, "
                           "    init_init_method, "
                           "    init_random_state, "
                           "    init_angle, "
                           "    is_n_components_fixed, "
                           "    is_perplexity_fixed, "
                           "    is_early_exaggeration_fixed, "
                           "    is_learning_rate_fixed, "
                           "    is_n_iter_fixed, "
                           "    is_min_grad_norm_fixed, "
                           "    is_metric_fixed, "
                           "    is_init_method_fixed, "
                           "    is_random_state_fixed, "
                           "    is_angle_fixed "
                           ") "
                           "values (%s, %s, %s, %s, %s, %s, %s, %s, %s, "
                           "        %s, %s, %s, %s, %s, %s, %s, %s, %s, "
                           "        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ",
                           (
                               run_config["runName"],
                               "",
                               run_config["measureWeight_trustworthiness"],
                               run_config["measureWeight_continuity"],
                               run_config["measureWeight_generalization"],
                               run_config["measureWeight_relativeWEQ"],
                               dataset_id,
                               run_config["numWords"],
                               run_config["numDimensions"],
                               run_config["perplexity"],
                               run_config["earlyExaggeration"],
                               run_config["learningRate"],
                               run_config["numIterations"],
                               pow(10, run_config["minGradNorm"]),
                               run_config["metric"],
                               run_config["initMethod"],
                               run_config["randomState"],
                               run_config["angle"],
                               run_config["is_numDimensions_fixed"],
                               run_config["is_perplexity_fixed"],
                               run_config["is_earlyExaggeration_fixed"],
                               run_config["is_learningRate_fixed"],
                               run_config["is_numIterations_fixed"],
                               run_config["is_minGradNorm_fixed"],
                               run_config["is_metric_fixed"],
                               run_config["is_initMethod_fixed"],
                               run_config["is_randomState_fixed"],
                               run_config["is_angle_fixed"]
                           ))

            self.connection.commit()

        except psycopg2.Error as e:
            return e

    def read_runs_for_dataset(self, dataset_name):
        """
        Reads all runs in database for specified dataset.
        :param dataset_name:
        :return: List of run metadata for this dataset.
        """
        cursor = self.connection.cursor()

        cursor.execute("select "
                       "   row_to_json(t) "
                       " from ( "
                       "    select "
                       "        r.*, "
                       "        d.name "
                       "    from "
                       "        tapas.runs r "
                       "    inner join tapas.datasets d on "
                       "        d.id = r.datasets_id and "
                       "        d.name = %s"
                       ") t;",
                       (dataset_name,))

        return [row[0] for row in cursor.fetchall()]

    def read_word_vectors_for_dataset(self, dataset_name):
        """
        Fetches all word vectors for specified dataset.
        :param dataset_name:
        :return: Dataframe with word vector data and metadata.
        """
        cursor = self.connection.cursor()

        # Get word vector data and store it in dataframe.
        cursor.execute("select "
                       "    w.id, "
                       "    w.word,"
                       "    coalesce(w.cluster_id, 0), "
                       "    w.values "
                       "from "
                       "    tapas.word_vectors w "
                       "inner join tapas.datasets d on "
                       "    d.id = w.datasets_id and "
                       "    d.name = %s "
                       "order by w.id asc",
                       (dataset_name,))

        # Create dataframe with data. Cast vector data to numpy arrays.
        return pandas.DataFrame.from_records(
            [[int(row[0]), row[1], int(row[2]), numpy.asarray(row[3])] for row in cursor.fetchall()],
            columns=["id", "word", "cluster_id", "values"],
            index=["word"]
        )

    def set_dataset_qvec_score(self, dataset_name, qvec_score):
        """
        Updates dataset's QVEC score in database.
        :param dataset_name:
        :param qvec_score:
        :return:
        """
        cursor = self.connection.cursor()

        cursor.execute("update tapas.datasets "
                       "set "
                       "    qvec_score = %s "
                       "where "
                       "    name = %s",
                       (qvec_score, dataset_name, ))
        self.connection.commit()

    def update_word_vectors_cluster_ids(self, word_embedding):
        """
        Updates word vectors' cluster IDs in database.
        :param word_embedding:
        :return:
        """
        cursor = self.connection.cursor()

        cursor.executemany('''
            update tapas.word_vectors
            set
                cluster_id = %(cluster_id)s
            where
                id = %(id)s
        ''', [
            # Convert relevant columns in dataframe to dictionary.
            {"id": int(x[0]), "cluster_id": int(x[1])} for x in word_embedding[['id', 'cluster_id']].values
        ])

        self.connection.commit()

    def insert_tsne_model(self, tsne_configuration, sequence_number_in_run):
        """
        Inserts metadata of new t-SNE model into database.
        :param tsne_configuration:
        :param sequence_number_in_run: Model's sequence number in particular run.
        :return:
        """
        cursor = self.connection.cursor()

        try:
            # Fetch run.
            cursor.execute("select "
                           "    r.id,"
                           "    r.datasets_id "
                           "from "
                           "    tapas.runs r "
                           "where "
                           "    r.title = %s ",
                           (tsne_configuration["runName"],))
            run_id = cursor.fetchone()[0]

            cursor.execute("""
                insert into tapas.tsne_models (
                    n_components,
                    perplexity,
                    early_exaggeration,
                    learning_rate,
                    n_iter,
                    min_grad_norm,
                    metric,
                    init_method,
                    random_state,
                    angle,
                    runs_sequence_number,
                    runs_id
                )
                values (%s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s)
                returning id
            """, (
                tsne_configuration["numDimensions"],
                tsne_configuration["perplexity"],
                tsne_configuration["earlyExaggeration"],
                tsne_configuration["learningRate"],
                tsne_configuration["numIterations"],
                pow(10, tsne_configuration["minGradNorm"]),
                tsne_configuration["metric"],
                tsne_configuration["initMethod"],
                tsne_configuration["randomState"],
                tsne_configuration["angle"],
                sequence_number_in_run,
                run_id
            ))

            self.connection.commit()

            # Return new entry's ID.
            return cursor.fetchone()[0]

        except psycopg2.Error as e:
            return -1

    def insert_tsne_coordinates(self, tsne_model_id, word_ids, cluster_ids, tsne_result):
        """
        Inserts results of t-SNE run (word vectors' low-dim. coordinates) into DB.
        :param tsne_model_id:
        :param word_ids: DB IDs of words. In same sequence as entries in tsne_result.
        :param cluster_ids:
        :param tsne_result:
        :return:
        """
        cursor = self.connection.cursor()

        # 0. Create tuples to insert.
        tuples_to_insert = [
            # Pick word's DB index at this position; cast numpy values to int.
            (int(word_ids[i]), tsne_model_id, int(cluster_ids[i]), [x.item() for x in tsne_result[i]])
            for i in range(0, word_ids.shape[0])
        ]

        # 1. Drop foreign key constraints to other tables before import.
        cursor.execute("""
            ALTER TABLE tapas.word_vectors_in_tsne_models
            DROP CONSTRAINT IF EXISTS word_vectors_in_tsne_models_word_vectors;

            ALTER TABLE tapas.word_vectors_in_tsne_models
            DROP CONSTRAINT IF EXISTS word_vectors_in_tsne_models_tsne_models;
        """)

        # 2. Write word vectors to DB.
        cursor.execute(cursor.mogrify("insert into tapas.word_vectors_in_tsne_models ("
                                      "         word_vectors_id, "
                                      "         tsne_models_id, "
                                      "         cluster_id, "
                                      "         coordinates) "
                                      " values " +
                                      ','.join(["%s"] * len(tuples_to_insert)), tuples_to_insert))

        # 3. Reintroduce foreign key constraints.
        cursor.execute("""
            ALTER TABLE tapas.word_vectors_in_tsne_models ADD CONSTRAINT word_vectors_in_tsne_models_tsne_models
            FOREIGN KEY (tsne_models_id)
            REFERENCES tapas.tsne_models (id)
            NOT DEFERRABLE
            INITIALLY IMMEDIATE;

            ALTER TABLE tapas.word_vectors_in_tsne_models ADD CONSTRAINT word_vectors_in_tsne_models_word_vectors
            FOREIGN KEY (word_vectors_id)
            REFERENCES tapas.word_vectors (id)
            NOT DEFERRABLE
            INITIALLY IMMEDIATE;
        """)

        self.connection.commit()

    def read_tsne_results(self, tsne_model_id):
        """
        Fetches all coordinate vectors and cluster IDs for specified t-SNE model.
        :param tsne_model_id:
        :return: Dataframe with words as index and coordinates, cluster ID as value.
        """
        cursor = self.connection.cursor()

        # Get word vector data and store it in dataframe.
        cursor.execute("""
            select
              wv.word,
              wvt.coordinates,
              wvt.cluster_id
            from
              tapas.word_vectors_in_tsne_models wvt
            inner join tapas.word_vectors wv on
              wv.id = wvt.word_vectors_id
            where
              tsne_models_id = %s
        """, (tsne_model_id,))

        # Create dataframe with data. Cast vector data to numpy arrays.
        return pandas.DataFrame.from_records(
            [[row[0], numpy.asarray(row[1]), int(row[2])] for row in cursor.fetchall()],
            columns=["word", "values", "cluster_id"],
            index=["word"]
        )

    def set_tsne_quality_scores(self, tsne_id, qvec_score, trustworthiness, continuity, generalization_accuracy):
        """
        Writes calculated quality scores for t-SNE model to DB.
        Calculates user quality score (can be overriden by user) as weighted average of all individual quality scores.
        :param tsne_id:
        :param qvec_score:
        :param trustworthiness:
        :param continuity:
        :param generalization_accuracy:
        :return:
        """
        cursor = self.connection.cursor()

        # Fetch dataset's QVEC score to calculate relative word embedding information ratio.
        cursor.execute("""
            with

            dataset_qvec_score as (
                select
                    d.qvec_score
                from
                    tapas.datasets d
                inner join tapas.runs r on
                    r.datasets_id = d.id
                inner join tapas.tsne_models tm on
                    tm.runs_id = r.id and
                    tm.id = %s
            ),

            -- Fetch corresponding run.
            run_measure_weights as (
                select
                    r.measure_weight_generalization_accuracy,
                    r.measure_weight_continuity,
                    r.measure_weight_trustworthiness,
                    r.measure_weight_we_information_ratio
                from
                    tapas.tsne_models t
                inner join tapas.runs r on
                    r.id = t.runs_id
                where
                    t.id = %s
            )

            -- Update quality scores. Calculate intermediate user quality score as weighted average.
            update tapas.tsne_models
            set
                measure_trustworthiness = %s,
                measure_continuity = %s,
                measure_generalization_accuracy = %s,
                measure_word_embedding_information_ratio = %s / (
                  select
                    qvec_score
                  from
                    dataset_qvec_score
                )::float,
                measure_user_quality = (
                    (
                        least(%s, 1) * (
                            select
                                measure_weight_trustworthiness
                            from
                                run_measure_weights
                        ) +
                        least(%s, 1) * (
                            select
                                measure_weight_continuity
                            from
                                run_measure_weights
                        ) +
                        least(%s, 1) * (
                            select
                                measure_weight_generalization_accuracy
                            from
                                run_measure_weights
                        ) +
                        -- QVEC score: Calculate quality relative to original WE; weight it.
                        least(%s / (
                            select
                                qvec_score
                            from
                                dataset_qvec_score
                        )::float, 1) * (
                            select
                                measure_weight_we_information_ratio
                            from
                                run_measure_weights
                        )
                    )::float / (
                        select
                            measure_weight_trustworthiness +
                            measure_weight_continuity +
                            measure_weight_generalization_accuracy +
                            measure_weight_we_information_ratio
                        from
                            run_measure_weights
                    )
                )
            where
                id = %s
            ;
        """, (
            tsne_id,
            tsne_id,
            trustworthiness,
            continuity,
            generalization_accuracy,
            qvec_score,
            trustworthiness,
            continuity,
            generalization_accuracy,
            qvec_score,
            tsne_id))

        self.connection.commit()

    def read_tsne_results_for_latest_tsne_model_in_run(self, run_title):
        """
        Reads t-SNE values for latest t-SNE model in specified run.
        See self.read_tsne_results(tsne_model_id).
        :param run_title:
        :param limit_to_number_of_words_to_use: Specifies whether all results or just the first number_of_words should
        be returned. Words are picked based on their indices (lower ones being more frequent/important).
        :return: Dataframe with t-SNE results for latest model in specified run.
        """
        cursor = self.connection.cursor()

        # Fetch ID of latest model.
        cursor.execute("""
            select
                tm.id as tsne_model_id
            from
                tapas.tsne_models tm
            inner join tapas.runs r on
                r.id = tm.runs_id and
                r.title = %s
            order by
                tm.id desc
            limit 1
        """, (run_title,))
        tsne_model_id = cursor.fetchone()[0]

        # Fetch number of words to use for this dataset.
        cursor.execute("""
            select
                r.num_words
            from
                tapas.runs r
            where
                r.title = %s
        """, (run_title,))

        # Return t-SNE results, limites to number of words actually to be used.
        return self.read_tsne_results(tsne_model_id).head(n=cursor.fetchone()[0])

    def read_metadata_for_run(self, run_title):
        """
        Reads metadata for all runs in specified dataset.
        :param run_title:
        :return:
        """
        cursor = self.connection.cursor()

        cursor.execute("""
            select
              row_to_json(t)
            from (
              select
                d.name as dataset,
                r.title,
                r.num_words,
                tm.runs_sequence_number,
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
                tm.measure_user_quality,
                r.is_early_exaggeration_fixed,
                r.is_init_method_fixed,
                r.is_learning_rate_fixed,
                r.is_n_iter_fixed,
                r.is_metric_fixed,
                r.is_min_grad_norm_fixed,
                r.is_n_components_fixed,
                r.is_perplexity_fixed,
                r.is_random_state_fixed,
                r.is_angle_fixed,
                r.measure_weight_trustworthiness,
                r.measure_weight_generalization_accuracy,
                r.measure_weight_continuity,
                r.measure_weight_we_information_ratio
              from
                tapas.datasets d
              inner join tapas.runs r on
                r.datasets_id = d.id and
                r.title = %s
              inner join tapas.tsne_models tm on
                tm.runs_id = r.id
              order by
                r.id asc,
                tm.runs_sequence_number asc
            ) t
        """, (run_title,))

        return [row[0] for row in cursor.fetchall()]
