# @author rmitsch
# @date 2017-10-27
#

import re
from flask import Flask
from flask import render_template
from flask import request, redirect, url_for, send_from_directory
import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
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
db_connector = Utils.connect_to_database()
# Initialize flask app.
app = init_flask_app()

# Define version.
version = "0.1"
# Buffer for storing last line, if it's interrupted by chunking.
interrupted_last_line_buffer = None
# Store number of dimensions for current dataset.
num_dimensions = -1


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
    # Declare global variable for interrupted lines.
    global interrupted_last_line_buffer
    # Declare global variable for number of dimensions.
    global num_dimensions
    # Lists for storing data for inserts.
    words = []
    vectors = []

    # Parse data.
    stream, form, files = werkzeug.formparser.parse_form_data(
        request.environ,
        stream_factory=Utils.generate_custom_stream_factory
    )
    # Retrieve reference to sent file from generator.
    for file_item in files.values():
        file = file_item
    # If first chunk (i. e. user is uploading a new dataset): Determine number of dimensions.
    if int(request.args['resumableChunkNumber']) == 1:
        # Reset status attributes.
        interrupted_last_line_buffer = None

        # Read first line to get number of dimensions.
        for line in file:
            # Cast number of dimensions to int.
            num_dimensions = int(re.sub(r"([\\n]|[']|[ ])", "", str(line).split(' ')[1]))
            break

    # Create entry in datasets, if it doesn't exist yet.
    dataset_id = db_connector.import_dataset(request.args['resumableFilename'], num_dimensions)

    # Count lines in chunk.
    count = 0
    for line in file:
        # Ignore first line in first chunk.
        if int(request.args['resumableChunkNumber']) == 1 and count > 0 \
                or int(request.args['resumableChunkNumber']) > 1:
            merged_line = line

            # If line is interrupted (and therefore presumedly the last line in chunk): Store interrupted last line.
            if not line.endswith(b'\n'):
                interrupted_last_line_buffer = line

            else:
                # If first line: Join last line from last chunk and first line from this chunk.
                if count == 0 and interrupted_last_line_buffer is not None:
                    merged_line = interrupted_last_line_buffer + line
                    # Reset buffer/flag for interrupted last line.
                    interrupted_last_line_buffer = None

                # Add line to collection of items to insert in DB. Remove trailing \n.
                line_parts = str(merged_line).replace(' \\n', '').split(' ')

                # Line has to contain num_dimennsions elements (word + coordinates). Otherwise invalid.
                if len(line_parts) == num_dimensions + 1:
                    # Append word.
                    words.append(line_parts[0].replace('b\'', ''))
                    # Cast coordinate vector to float. Remove remaining special characters.
                    vectors.append([float(x.replace('\'', '')) for x in line_parts[1:]])
                    print(vectors)

                    # Next:
                    #   - Create class for word vectors, move transformation code there.
                    #   - Insert word vectors into DB.
                    #   - Integrate DB with initial parameter histograms.
                    #   - Construct dashboard layout.

                    input()
                else:
                    print("corrupt: ")
                    print(merged_line)
                    print(line)
                    print("---------------")

            count += 1

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
