# @author RM
# @date 2017-08-08
# Class for connecting to database. Uses exactly one connection.
#

import psycopg2
import sys
import logging
import numpy
import json

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
        except:
            self.logger.critical("Connection to database failed. Check parameters.")

    def construct_database(self, path="ddl.sql", reconstruct=False):
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
                cursor.execute(open("backend/database/ddl.sql", "r").read())
                self.connection.commit()

        except:
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

    def read_first_run_metadata(self):
        """
        Reads metadata for all first runs in database.
        Used in view "Generate new run".
        :return:
        """
        cursor = self.connection.cursor()

        cursor.execute("select "
                       "  row_to_json(t) "
                       "from ("
                       "  select "
                       "   d.name as dataset, "
                       "   r.measure_weight_trustworthiness as measureWeight_trustworthiness, "
                       "   r.measure_weight_continuity as measureWeight_continuity, "
                       "   r.measure_weight_generalization_accuracy as measureWeight_generalization, "
                       "   r.measure_weight_we_information_ratio as measureWeight_relativeWEQ, "
                       "   r.init_n_components as numDimensions, "
                       "   r.init_perplexity as perplexity, "
                       "   r.init_early_exaggeration as earlyExaggeration, "
                       "   r.init_learning_rate as learningRate, "
                       "   r.init_n_iter as numIterations, "
                       "   r.init_min_grad_norm as minGradNorm, "
                       "   r.init_metric as metric, "
                       "   r.init_init_method as initMethod, "
                       "   r.init_random_state as randomState, "
                       "   r.init_angle as angle, "
                       "   count(distinct wv.id) as numWords"
                       " from "
                       "   tapas.datasets d "
                       " inner join tapas.runs r on "
                       "   r.datasets_id = d.id "
                       " inner join tapas.word_vectors wv on "
                       "   wv.datasets_id = d.id "
                       "  group by "
                       "   d.name, "
                       "   r.measure_weight_trustworthiness, "
                       "   r.measure_weight_continuity, "
                       "   r.measure_weight_generalization_accuracy, "
                       "   r.measure_weight_we_information_ratio, "
                       "   r.init_n_components, "
                       "   r.init_perplexity, "
                       "   r.init_early_exaggeration, "
                       "   r.init_learning_rate, "
                       "   r.init_n_iter, "
                       "   r.init_min_grad_norm, "
                       "   r.init_metric, "
                       "   r.init_init_method, "
                       "   r.init_random_state, "
                       "   r.init_angle "
                       ") t ")
        res = cursor.fetchall()

        return [row[0] for row in res]
