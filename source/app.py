# @author rmitsch
# @date 2017-10-27
#

import os
from flask import Flask
from flask import render_template
from flask import request, redirect, url_for, send_from_directory
import backend.database.DBConnector as DBConnector
import backend.utils.Utils as Utils
import logging
import psycopg2

# Create logger.
Utils.create_logger()
logger = logging.getLogger("tapas")
logger.info("Starting test.py.")

# Create database connection.
db_connector = DBConnector(host="localhost",
                           database="tapas",
                           port="8002",
                           user="admin",
                           password="password")
# Construct database.
db_connector.construct_database(reconstruct=True)


app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')
# Define version.
version = "0.1"


# root: Render HTML for start menu.
@app.route("/")
def index():
    return render_template("index.html", version=version, entrypoint="about")


# Parse and upload CSV with word vectors.
@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    # Check if the file is one of the allowed types/extensions
    if file:
        # Move the file from the temporal folder to the upload folder we set up.
        #file.save(os.path.join(app.config['UPLOAD_FOLDER'], "spreadsheet.ods"))
        # Redirect the user to the uploaded_file route, which will basicaly show on the browser the uploaded file.
        return redirect("/#menu_createrun")

    else:
        return "Wrong file format."


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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=7182, debug=True)
