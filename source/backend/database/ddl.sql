-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2017-11-07 20:27:06.883

create schema tapas;

-- tables
-- Table: datasets
CREATE TABLE tapas.datasets (
    id serial  NOT NULL,
    name text  NOT NULL,
    n_dim int  NOT NULL CHECK (n_dim > 0),
    quality real  NULL,
    CONSTRAINT c_datasets_u_name UNIQUE (name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT datasets_pk PRIMARY KEY (id)
);

-- Table: run
CREATE TABLE tapas.runs (
    id serial  NOT NULL,
    title text  NULL,
    description text  NULL,
    measure_weight_trustworthiness int  NOT NULL DEFAULT 1,
    measure_weight_continuity int  NOT NULL DEFAULT 1,
    measure_weight_lcmc int  NOT NULL DEFAULT 1,
    measure_weight_generalization_accuracy int  NOT NULL DEFAULT 1,
    measure_weight_word_embedding_information_ratio int  NOT NULL,
    n_components int  NOT NULL,
    datasets_id int  NOT NULL,
    CONSTRAINT run_pk PRIMARY KEY (id)
);

-- Table: tsne_models
CREATE TABLE tapas.tsne_models (
    id serial  NOT NULL,
    n_components int  NOT NULL,
    perplexity real  NOT NULL,
    early_exaggeration real  NOT NULL,
    learning_rate real  NOT NULL,
    n_iter int  NOT NULL,
    min_grad_norm real  NOT NULL,
    metric text  NOT NULL,
    init_method text  NOT NULL,
    random_state int  NULL,
    angle float  NOT NULL,
    measure_trustworthiness real  NULL,
    measure_continuity real  NULL,
    measure_generalization_accuracy real  NULL,
    measure_word_embedding_information_ratio real  NULL,
    measure_user_quality real  NULL,
    measure_we_quality real  NULL,
    run_sequence_number int  NOT NULL CHECK (run_sequence_number > 0),
    run_id int  NOT NULL,
    CONSTRAINT c_u_tsne_models_params_corpora_id UNIQUE (early_exaggeration, perplexity, learning_rate, n_iter, min_grad_norm, init_method, metric, random_state, angle, n_components, runs_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT tsne_models_pk PRIMARY KEY (id)
);

-- Table: word_vectors
CREATE TABLE tapas.word_vectors (
   id serial  NOT NULL,
   word text  NOT NULL,
   values real[]  NOT NULL,
   datasets_id int  NOT NULL,
   cluster_id int  NULL,
   CONSTRAINT c_word_vectors_u_dataset_word UNIQUE (word, datasets_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
   CONSTRAINT word_vectors_pk PRIMARY KEY (id)
);

-- Table: word_vectors_in_tsne_models
CREATE TABLE tapas.word_vectors_in_tsne_models (
    word_vectors_id int  NOT NULL,
    tsne_models_id int  NOT NULL,
    coordinates real[]  NOT NULL,
    cluster_id int  NULL,
    CONSTRAINT word_vectors_in_tsne_models_pk PRIMARY KEY (word_vectors_id,tsne_models_id)
);

-- foreign keys
-- Reference: run_datasets (table: run)
ALTER TABLE tapas.runs ADD CONSTRAINT run_datasets
    FOREIGN KEY (datasets_id)
    REFERENCES tapas.datasets (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: tsne_models_run (table: tsne_models)
ALTER TABLE tapas.tsne_models ADD CONSTRAINT tsne_models_run
    FOREIGN KEY (run_id)
    REFERENCES tapas.runs (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: word_vectors_datasets (table: word_vectors)
ALTER TABLE tapas.word_vectors ADD CONSTRAINT word_vectors_datasets
    FOREIGN KEY (datasets_id)
    REFERENCES tapas.datasets (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: word_vectors_in_tsne_models_tsne_models (table: word_vectors_in_tsne_models)
ALTER TABLE tapas.word_vectors_in_tsne_models ADD CONSTRAINT word_vectors_in_tsne_models_tsne_models
    FOREIGN KEY (tsne_models_id)
    REFERENCES tapas.tsne_models (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: word_vectors_in_tsne_models_word_vectors (table: word_vectors_in_tsne_models)
ALTER TABLE tapas.word_vectors_in_tsne_models ADD CONSTRAINT word_vectors_in_tsne_models_word_vectors
    FOREIGN KEY (word_vectors_id)
    REFERENCES tapas.word_vectors (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

