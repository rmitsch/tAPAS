# @author rmitsch
# @date 2017-10-27
#

import re
from flask import Flask
from flask import render_template
from flask import request, redirect, url_for, send_from_directory
import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
from backend.algorithm.WordVector import WordVector
import logging
import psycopg2
import werkzeug


def init_flask_app():
    """
    Initialize Flask app.
    :return: App object.
    """
    app = Flask(__name__,
                template_folder='frontend/templates',
                static_folder='frontend/static')
    # Limit of 100 MB for upload.
    app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024

    return app


# Initialize logger.
logger = Utils.create_logger()
# Connect to database.
db_connector = Utils.connect_to_database(False)
# Initialize flask app.
app = init_flask_app()

# Define version.
version = "0.1"
# # Buffer for storing last line, if it's interrupted by chunking.
# interrupted_last_line_buffer = None
# # Store number of dimensions for current dataset.
# num_dimensions = -1


# root: Render HTML for start menu.
@app.route("/")
def index():
    return render_template("index.html", version=version, entrypoint="about")


@app.route('/', defaults={'path': ''}, methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
def upload(path):
    """
    Constant memory-parsing of (word vector) files.
    :param path:
    :return:
    """

    # Next:
    #   - Create class for word vectors, move transformation code there.
    #   - Insert word vectors into DB.
    #   - Integrate DB with initial parameter histograms.
    #   - Construct dashboard layout.

    file_chunk = None

    # Parse data.
    stream, form, files = werkzeug.formparser.parse_form_data(
        request.environ,
        stream_factory=Utils.generate_custom_stream_factory
    )
    # Retrieve reference to sent file from generator.
    for file_item in files.values():
        file_chunk = file_item

    # If first chunk (i. e. user is uploading a new dataset): Determine number of dimensions.
    if int(request.args['resumableChunkNumber']) == 1:
        WordVector.extract_number_of_dimensions(file_chunk)

    # Create entry in datasets, if it doesn't exist yet. Otherwise just fetch ID.
    dataset_id = db_connector.import_dataset(
        request.args['resumableFilename'],
        WordVector.num_dimensions
    )

    # Extract content from file.
    tuples_to_insert = WordVector.extract_word_vectors_from_file_chunk(
        file_chunk=file_chunk,
        chunk_number=int(request.args['resumableChunkNumber']),
        dataset_id=dataset_id)

    # Insert vectors in this chunk into DB.
    db_connector.import_word_vectors(tuples_to_insert)

    return "200"

# /about
# @app.route("/about")
# def about():
#     return render_template("index.html", version=version, entrypoint="about")
#
#
# # /upload
# @app.route("/upload")
# def upload():
#     return render_template("index.html", version=version, entrypoint="upload")
#
#
# # /about
# @app.route("/createrun")
# def createrun():
#     return render_template("index.html", version=version, entrypoint="createrun")
#
#
# # /about
# @app.route("/run")
# def run():
#     return render_template("index.html", version=version, entrypoint="run")

@app.route('/carousel_content', methods=["GET", "POST"])
def fetch():
    return app.send_static_file('index_carousel.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=7182, debug=True)
