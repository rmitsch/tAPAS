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