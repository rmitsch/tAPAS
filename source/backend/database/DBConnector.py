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
            print("Connection successful")
        except:
            self.logger.critical("Connection to database failed. Check parameters.")

    def construct_database(self):
        """
        Execute DDL.
        :return:
        """
        # Create cursor.
        cursor = self.connection.cursor()
        # Execute ddl.sql.
        try:
            # todo Remove: For testing purposes - database reset at startup.
            cursor.execute("drop schema if exists topac cascade")
            self.connection.commit()
            cursor.execute(open("backend/database/ddl.sql", "r").read())
            self.connection.commit()
        except:
            print(sys.exc_info()[1])

    def load_terms_in_corpus(self, corpus_id):
        """
        Loads all terms in corpus and returns it as map.
        :param corpus_id:
        :return: Map in the form of "term: {terms_ID, terms_in_corpora_ID}"
        """

        cursor = self.connection.cursor()

        cursor.execute("select "
                       "    t.term, "
                       "    t.id, "
                       "    tic.id "
                       "from "
                       "    topac.terms t "
                       "inner join topac.terms_in_corpora tic on"
                       "    tic.terms_id    = t.id and "
                       "    tic.corpora_id  = %s",
                       (corpus_id,))

        # Transform result in map.
        term_dict = {}
        for row in cursor.fetchall():
            term_dict[row[0]] = {}
            term_dict[row[0]]["terms_id"] = row[1]
            term_dict[row[0]]["terms_in_corpora_id"] = row[2]
            # Initialize index value as utiliary field with None.
            term_dict[row[0]]["index"] = None

        return term_dict

    def load_term_coordinates(self, doc2vec_model_id):
        """
        Loads all terms in corpus and returns it as map.
        :param doc2vec_model_id:
        :return: Map in the form of "term: {coordinates}"
        """

        cursor = self.connection.cursor()

        cursor.execute("select "
                       "    t.term,"
                       "    td.coordinates "
                       "from "
                       "    topac.terms_in_doc2vec_model td "
                       "inner join topac.terms_in_corpora tc on"
                       "    tc.id = td.terms_in_corpora_id "
                       "inner join topac.terms t on "
                       "    t.id = tc.terms_id",
                       (doc2vec_model_id,))

        # Transform result in map.
        term_coordinate_dict = {}
        for row in cursor.fetchall():
            term_coordinate_dict[row[0]] = row[1]

        return term_coordinate_dict

    def load_facets_in_corpus(self, corpus_id):
        """
        Loads all facets in corpus and returns it as map.
        :param corpus_id:
        :return: Map in the form of "id: {facet_label_key}"
        """

        cursor = self.connection.cursor()

        cursor.execute("select "
                       "    cfa.id "
                       "from "
                       "    topac.corpus_facets cfa "
                       # Exclude all corpus features and facets not associated with this corpus.
                       "inner join topac.corpus_features cfe on "
                       "    cfe.id          = cfa.corpus_features_id and "
                       "    cfe.corpora_id  = %s",
                       (corpus_id,))

        # Transform result in map.
        facet_dict = {}
        for row in cursor.fetchall():
            facet_dict[row[0]] = {}
            facet_dict[row[0]]["facet_label"] = "t:" + str(row[0])
            # Initialize index value as utiliary field with None.
            facet_dict[row[0]]["index"] = None

        return facet_dict

    def fetch_corpus_id(self, corpus_title):
        """
        Reads corpus_id from database for given corpus_title.
        :param corpus_title:
        :return: Corpus ID for this title.
        """

        cursor = self.connection.cursor()
        cursor.execute("select "
                       "   id "
                       "from "
                       "   topac.corpora c "
                       "where "
                       "   c.title = %s",
                       (corpus_title,))
        res = cursor.fetchone()

        # Return corpus ID.
        return res[0]

    def truncate_database(self):
        """
        Truncates tables database (leaves structure intact).
        :return:
        """

        cursor = self.connection.cursor()

        cursor.execute("truncate table  topac.corpora, "
                       "                topac.corpus_features, "
                       "                topac.doc2vec_models, "
                       "                topac.documents, "
                       "                topac.stopwords, "
                       "                topac.terms_in_corpora, "
                       "                topac.corpus_facets, "
                       "                topac.corpus_features_in_documents, "
                       "                topac.corpus_facets_in_doc2vec_models, "
                       "                topac.terms_in_doc2vec_model, "
                       "                topac.topic_models, "
                       "                topac.topics, "
                       "                topac.terms_in_topics, "
                       "                topac.corpus_facets_in_topics "
                       "restart identity")
        self.connection.commit()

    def truncate_topic_tables(self):
        """
        Truncates topic-related tables in database (leaves structure intact).
        :return:
        """

        cursor = self.connection.cursor()

        cursor.execute("truncate table  topac.topic_models, "
                       "                topac.topics, "
                       "                topac.terms_in_topics, "
                       "                topac.corpus_facets_in_topics "
                       "restart identity")
        self.connection.commit()

    def fetch_corpus_feature_id(self, corpus_id, corpus_feature_title):
        """
        Reads corpus_feature_id from database for determined corpus ID and corpus_feature_title.
        :param corpus_id:
        :param corpus_feature_title:
        :return: Corpus feature ID for this corpus feature title in this corpus.
        """

        cursor = self.connection.cursor()
        cursor.execute("select "
                       "   cf.id "
                       "from "
                       "   topac.corpus_features cf "
                       "inner join topac.corpora c on "
                       "    c.id = cf.corpora_id and "
                       "    c.id = %s"
                       "where "
                       "   cf.title = %s",
                       (corpus_id, corpus_feature_title))

        # Return corpus feature ID.
        return cursor.fetchone()[0]

    def fetch_doc2vec_gensim_model(self, doc2vec_model_id):
        """
        Loads topac.doc2vec_models.gensim_model from database.
        :param doc2vec_model_id:
        :return: Gensim's model for this model wrapper ID.
        """

        cursor = self.connection.cursor()
        cursor.execute("select "
                       "   d.gensim_model "
                       "from "
                       "   topac.doc2vec_models d "
                       "where "
                       "   d.id = %s",
                       (doc2vec_model_id,))

        # Return corpus feature ID.
        return cursor.fetchone()[0]
