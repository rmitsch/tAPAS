# @author RM
# @date 2017-08-08
# Class for connecting to database. Uses exactly one connection.
#

import psycopg2
import sys
import logging
import numpy


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
                       "    coalesce(id, -1)"
                       "from "
                       "    tapas.datasets "
                       "where "
                       "    name = %s",
                       (dataset_name,))
        dataset_id = cursor.fetchone()[0]

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

    def import_word_vectors(self, dataset_id, words, vectors):
        """
        Import word vectors into database.
        :param dataset_id:
        :param words:
        :param vectors:
        :return:
        """
        cursor = self.connection.cursor()

        # 1. Generate tuples.
        tuples_to_insert = []
        for index in range(0, len(words)):
            tuples_to_insert.append((words[index],
                                     vectors[index],
                                     dataset_id))

        # 2. Write word vectors to DB.
        cursor.execute(cursor.mogrify("insert into "
                                      "     tapas.word_vectors ("
                                      "         word, "
                                      "         values, "
                                      "         datasets_id) "
                                      " values " +
                                      ','.join(["%s"] * len(tuples_to_insert)), tuples_to_insert))
