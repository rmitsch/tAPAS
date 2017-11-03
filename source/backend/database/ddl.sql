-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2017-09-15 19:16:12.73

create schema topac;

-- tables
-- Table: associated_topics_for_terms
CREATE TABLE topac.associated_topics_for_terms (
    terms_in_corpora_id int  NOT NULL,
    topics_id int  NOT NULL,
    CONSTRAINT associated_topics_for_terms_pk PRIMARY KEY (terms_in_corpora_id,topics_id)
);

-- Table: corpora
CREATE TABLE topac.corpora (
    id serial  NOT NULL,
    title text  NOT NULL,
    comment text  NULL,
    CONSTRAINT c_u_corpora_title UNIQUE (title) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT corpora_pk PRIMARY KEY (id)
);

-- Table: corpus_facets
CREATE TABLE topac.corpus_facets (
    id serial  NOT NULL,
    corpus_features_id int  NOT NULL,
    corpus_feature_value text  NOT NULL,
    summarized_text text  NOT NULL,
    sequence_number int  NOT NULL,
    comment text  NULL,
    CONSTRAINT c_u_facets_cf_id_cfv_id UNIQUE (corpus_features_id, corpus_feature_value) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT corpus_facets_pk PRIMARY KEY (id)
);

-- Table: corpus_facets_in_doc2vec_models
CREATE TABLE topac.corpus_facets_in_doc2vec_models (
    corpus_facets_id int  NOT NULL,
    doc2vec_models_id int  NOT NULL,
    coordinates int[]  NOT NULL,
    CONSTRAINT corpus_facets_in_doc2vec_models_pk PRIMARY KEY (corpus_facets_id,doc2vec_models_id)
);

-- Table: corpus_features
CREATE TABLE topac.corpus_features (
    id serial  NOT NULL,
    title text  NOT NULL,
    type text  NOT NULL,
    corpora_id int  NOT NULL,
    gensim_dictionary bytea  NULL,
    gensim_corpus bytea  NULL,
    comment text  NULL,
    CONSTRAINT c_u_corpus_features_title_corpora_id UNIQUE (title, corpora_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT corpus_features_pk PRIMARY KEY (id)
);

-- Table: corpus_features_in_documents
CREATE TABLE topac.corpus_features_in_documents (
    id serial  NOT NULL,
    corpus_features_id int  NOT NULL,
    documents_id int  NOT NULL,
    value text  NOT NULL,
    CONSTRAINT c_u_cfid_ocuments_cf_id_d_id UNIQUE (corpus_features_id, documents_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT corpus_features_in_documents_pk PRIMARY KEY (id)
);

-- Table: doc2vec_models
CREATE TABLE topac.doc2vec_models (
    id serial  NOT NULL,
    corpora_id int  NOT NULL,
    feature_vector_size int  NOT NULL,
    alpha real  NOT NULL,
    min_alpha real  NOT NULL,
    n_window int  NOT NULL,
    n_epochs int  NOT NULL,
    gensim_model bytea  NOT NULL,
    comment text  NULL,
    CONSTRAINT doc2vec_models_pk PRIMARY KEY (id)
);

-- Table: documents
CREATE TABLE topac.documents (
    id serial  NOT NULL,
    title text  NOT NULL,
    raw_text text  NOT NULL,
    refined_text text  NULL,
    coordinates integer[]  NULL,
    sentiment_score real  NOT NULL,
    corpora_id int  NOT NULL,
    comment int  NULL,
    CONSTRAINT c_u_documents_title_corpora_id UNIQUE (title, corpora_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT documents_pk PRIMARY KEY (id)
);

-- Table: stopwords
CREATE TABLE topac.stopwords (
    id serial  NOT NULL,
    word text  NOT NULL,
    corpora_id int  NOT NULL,
    comment text  NULL,
    CONSTRAINT c_u_stopwords_word_corpora_id UNIQUE (word, corpora_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT stopwords_pk PRIMARY KEY (id)
);

-- Table: terms
CREATE TABLE topac.terms (
    id serial  NOT NULL,
    term text  NOT NULL,
    CONSTRAINT c_u_terms_term UNIQUE (term) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT terms_pk PRIMARY KEY (id)
);

-- Table: terms_in_corpora
CREATE TABLE topac.terms_in_corpora (
    id serial  NOT NULL,
    corpora_id int  NOT NULL,
    terms_id int  NOT NULL,
    CONSTRAINT c_u_terms_in_corpora_corpora_id_tems_id UNIQUE (corpora_id, terms_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT terms_in_corpora_pk PRIMARY KEY (id)
);

-- Table: terms_in_doc2vec_model
CREATE TABLE topac.terms_in_doc2vec_model (
    doc2vec_models_id int  NOT NULL,
    terms_in_corpora_id int  NOT NULL,
    coordinates real[]  NOT NULL,
    CONSTRAINT terms_in_doc2vec_model_pk PRIMARY KEY (doc2vec_models_id,terms_in_corpora_id)
);

-- Table: terms_in_topics
CREATE TABLE topac.terms_in_topics (
    topics_id int  NOT NULL,
    terms_in_corpora_id int  NOT NULL,
    probability real  NOT NULL CHECK (probability > 0),
    CONSTRAINT terms_in_topics_pk PRIMARY KEY (topics_id,terms_in_corpora_id)
);

-- Table: topic_models
CREATE TABLE topac.topic_models (
    id serial  NOT NULL,
    alpha real  NOT NULL,
    eta real  NOT NULL,
    kappa real  NOT NULL,
    n_iterations int  NOT NULL,
    corpora_id int  NOT NULL,
    runtime int  NOT NULL,
    coordinates integer[]  NOT NULL,
    is_labeled bool  NOT NULL,
    comment text  NULL,
    CONSTRAINT c_u_topic_models_alpha_eta_kappa_corpora_id UNIQUE (alpha, eta, kappa, corpora_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT c_u_topic_models_corpora_id_corpus_features_id UNIQUE (corpora_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT topic_models_pk PRIMARY KEY (id)
);

-- Table: topics
CREATE TABLE topac.topics (
    id serial  NOT NULL,
    sequence_number int  NOT NULL,
    title text  NOT NULL,
    topic_models_id int  NOT NULL,
    quality int  NOT NULL,
    coordinates real[]  NOT NULL,
    coherence real  NOT NULL,
    corpus_facets_id int  NULL,
    comment text  NULL,
    CONSTRAINT c_u_topics_topic_number_document_feature_topic_models_id UNIQUE (topic_models_id, sequence_number) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT topics_pk PRIMARY KEY (id)
);

-- Table: topics_in_documents
CREATE TABLE topac.topics_in_documents (
    documents_id int  NOT NULL,
    topics_id int  NOT NULL,
    probability real  NOT NULL,
    CONSTRAINT topics_in_documents_pk PRIMARY KEY (documents_id,topics_id)
);

-- foreign keys
-- Reference: associated_topics_for_terms_terms_in_corpora (table: associated_topics_for_terms)
ALTER TABLE topac.associated_topics_for_terms ADD CONSTRAINT associated_topics_for_terms_terms_in_corpora
    FOREIGN KEY (terms_in_corpora_id)
    REFERENCES topac.terms_in_corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: associated_topics_for_terms_topics (table: associated_topics_for_terms)
ALTER TABLE topac.associated_topics_for_terms ADD CONSTRAINT associated_topics_for_terms_topics
    FOREIGN KEY (topics_id)
    REFERENCES topac.topics (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: corpus_facets_in_doc2vec_models_corpus_facets (table: corpus_facets_in_doc2vec_models)
ALTER TABLE topac.corpus_facets_in_doc2vec_models ADD CONSTRAINT corpus_facets_in_doc2vec_models_corpus_facets
    FOREIGN KEY (corpus_facets_id)
    REFERENCES topac.corpus_facets (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: corpus_facets_in_doc2vec_models_doc2vec_models (table: corpus_facets_in_doc2vec_models)
ALTER TABLE topac.corpus_facets_in_doc2vec_models ADD CONSTRAINT corpus_facets_in_doc2vec_models_doc2vec_models
    FOREIGN KEY (doc2vec_models_id)
    REFERENCES topac.doc2vec_models (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: corpus_feature_value_groupings_metadata_corpus_features (table: corpus_facets)
ALTER TABLE topac.corpus_facets ADD CONSTRAINT corpus_feature_value_groupings_metadata_corpus_features
    FOREIGN KEY (corpus_features_id)
    REFERENCES topac.corpus_features (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: corpus_features_corpora (table: corpus_features)
ALTER TABLE topac.corpus_features ADD CONSTRAINT corpus_features_corpora
    FOREIGN KEY (corpora_id)
    REFERENCES topac.corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: corpus_features_in_documents_corpus_features (table: corpus_features_in_documents)
ALTER TABLE topac.corpus_features_in_documents ADD CONSTRAINT corpus_features_in_documents_corpus_features
    FOREIGN KEY (corpus_features_id)
    REFERENCES topac.corpus_features (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: corpus_features_in_documents_documents (table: corpus_features_in_documents)
ALTER TABLE topac.corpus_features_in_documents ADD CONSTRAINT corpus_features_in_documents_documents
    FOREIGN KEY (documents_id)
    REFERENCES topac.documents (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: doc2vec_models_corpora (table: doc2vec_models)
ALTER TABLE topac.doc2vec_models ADD CONSTRAINT doc2vec_models_corpora
    FOREIGN KEY (corpora_id)
    REFERENCES topac.corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: documents_corpora (table: documents)
ALTER TABLE topac.documents ADD CONSTRAINT documents_corpora
    FOREIGN KEY (corpora_id)
    REFERENCES topac.corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: stopwords_corpora (table: stopwords)
ALTER TABLE topac.stopwords ADD CONSTRAINT stopwords_corpora
    FOREIGN KEY (corpora_id)
    REFERENCES topac.corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: terms_in_corpora_corpora (table: terms_in_corpora)
ALTER TABLE topac.terms_in_corpora ADD CONSTRAINT terms_in_corpora_corpora
    FOREIGN KEY (corpora_id)
    REFERENCES topac.corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: terms_in_corpora_terms (table: terms_in_corpora)
ALTER TABLE topac.terms_in_corpora ADD CONSTRAINT terms_in_corpora_terms
    FOREIGN KEY (terms_id)
    REFERENCES topac.terms (id)  
    DEFERRABLE 
    INITIALLY DEFERRED
;

-- Reference: terms_in_doc2vec_model_doc2vec_models (table: terms_in_doc2vec_model)
ALTER TABLE topac.terms_in_doc2vec_model ADD CONSTRAINT terms_in_doc2vec_model_doc2vec_models
    FOREIGN KEY (doc2vec_models_id)
    REFERENCES topac.doc2vec_models (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: terms_in_doc2vec_model_terms_in_corpora (table: terms_in_doc2vec_model)
ALTER TABLE topac.terms_in_doc2vec_model ADD CONSTRAINT terms_in_doc2vec_model_terms_in_corpora
    FOREIGN KEY (terms_in_corpora_id)
    REFERENCES topac.terms_in_corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: terms_in_topics_terms_in_corpora (table: terms_in_topics)
ALTER TABLE topac.terms_in_topics ADD CONSTRAINT terms_in_topics_terms_in_corpora
    FOREIGN KEY (terms_in_corpora_id)
    REFERENCES topac.terms_in_corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: terms_in_topics_topics (table: terms_in_topics)
ALTER TABLE topac.terms_in_topics ADD CONSTRAINT terms_in_topics_topics
    FOREIGN KEY (topics_id)
    REFERENCES topac.topics (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: topic_models_corpora (table: topic_models)
ALTER TABLE topac.topic_models ADD CONSTRAINT topic_models_corpora
    FOREIGN KEY (corpora_id)
    REFERENCES topac.corpora (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: topics_corpus_facets (table: topics)
ALTER TABLE topac.topics ADD CONSTRAINT topics_corpus_facets
    FOREIGN KEY (corpus_facets_id)
    REFERENCES topac.corpus_facets (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: topics_in_document_documents (table: topics_in_documents)
ALTER TABLE topac.topics_in_documents ADD CONSTRAINT topics_in_document_documents
    FOREIGN KEY (documents_id)
    REFERENCES topac.documents (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: topics_in_document_topics (table: topics_in_documents)
ALTER TABLE topac.topics_in_documents ADD CONSTRAINT topics_in_document_topics
    FOREIGN KEY (topics_id)
    REFERENCES topac.topics (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: topics_topic_models (table: topics)
ALTER TABLE topac.topics ADD CONSTRAINT topics_topic_models
    FOREIGN KEY (topic_models_id)
    REFERENCES topac.topic_models (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

