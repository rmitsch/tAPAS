# @author rmitsch
# @date 2017-10-27
#

from flask import Flask
from flask import render_template
from flask import request, redirect, url_for, send_from_directory
import backend.utils.Utils as Utils
from backend.algorithm.WordVector import WordVector
from backend.algorithm.QVEC import QVECConfiguration
import werkzeug
from flask import jsonify
from backend.algorithm.WordEmbeddingClusterer import WordEmbeddingClusterer


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
# Initialize flask app.
app = init_flask_app()
# Connect to database.
app.config["DB_CONNECTOR"] = Utils.connect_to_database(False)
# Define version.
app.config["VERSION"] = "0.1"
# Define container for repeatedly used data objects.
app.config["DATA"] = {}

# root: Render HTML for start menu.
@app.route("/")
def index():
    return render_template("index.html", version=app.config["VERSION"], entrypoint="about")


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
    dataset_id = app.config["DB_CONNECTOR"].import_dataset(
        request.args['resumableFilename'],
        WordVector.num_dimensions
    )

    # Extract content from file.
    tuples_to_insert = WordVector.extract_word_vectors_from_file_chunk(
        file_chunk=file_chunk,
        chunk_number=int(request.args['resumableChunkNumber']),
        dataset_id=dataset_id)

    # Insert vectors in this chunk into DB.
    # app.config["DB_CONNECTOR"].import_word_vectors(tuples_to_insert)

    return "200"


@app.route('/carousel_content', methods=["GET", "POST"])
def fetch_carousel():
    return app.send_static_file('index_carousel.html')


@app.route('/dashboard_content', methods=["GET"])
def fetch_dashboard():
    return app.send_static_file('dashboard.html')


@app.route('/dataset_metadata', methods=["GET", "POST"])
def fetch_dataset_metadata():
    return jsonify(app.config["DB_CONNECTOR"].read_first_run_metadata())


@app.route('/dataset_word_counts', methods=["GET"])
def fetch_dataset_word_counts():
    return jsonify(app.config["DB_CONNECTOR"].read_dataset_word_counts())


@app.route('/create_new_run', methods=["POST"])
def create_new_run():
    return str(app.config["DB_CONNECTOR"].insert_new_run(request.get_json()))


@app.route('/runs', methods=["GET"])
def read_runs_for_dataset():
    return jsonify(app.config["DB_CONNECTOR"].read_runs_for_dataset(dataset_name=request.args["dataset_name"]))


@app.route('/check_we_model', methods=["POST"])
def determine_wordembedding_accuracy():
    """
    Determines WE accuracy. Stores result in DB.
    :return: 200 if successful. 500 if failing.
    """
    dataset_name = request.get_json()

    # Fetch word embedding from DB.
    word_embedding = app.config["DB_CONNECTOR"].read_word_vectors_for_dataset(request.get_json())

    qvec = QVECConfiguration()
    app.config["DB_CONNECTOR"].set_dataset_qvec_score(
        dataset_name=dataset_name,
        qvec_score=qvec.run(word_embedding=word_embedding)
    )
    return "200"


@app.route('/cluster_we_model', methods=["POST"])
def cluster_wordembedding():
    """
    Clusters original WE using HDBSCAN.
    :return: 200 if successful. 500 if failing.
    """
    dataset_name = request.get_json()

    # Fetch word embedding from DB.
    word_embedding = app.config["DB_CONNECTOR"].read_word_vectors_for_dataset(request.get_json())

    clusterer = WordEmbeddingClusterer(word_embedding)
    cluster_labels = clusterer.run()
    print(cluster_labels)

    # CONTINUE HERE: Update word vector's cluster ID in DB.

    return "200"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=7182, debug=True)
