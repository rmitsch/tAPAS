# @author rmitsch
# @date 2017-10-27
#

import os
from flask import Flask
from flask import render_template
from flask import request, redirect, url_for, send_from_directory
import psycopg2


app = Flask(__name__)
# Define version.
version = "0.1"

#try:
#    connect_str = "dbname='testpython' user='matt' host='localhost' " + \
#                  "password='myOwnPassword'"
#    # use our connection values to establish a connection
#    conn = psycopg2.connect(connect_str)
#    # create a psycopg2 cursor that can execute queries
#    cursor = conn.cursor()
#    # create a new table with a single column called "name"
#    cursor.execute("""CREATE TABLE tutorials (name char(40));""")
#    # run a SELECT statement - no data in there, but we can try it
#    cursor.execute("""SELECT * from tutorials""")
#    rows = cursor.fetchall()
#    print(rows)
#except Exception as e:
#    print("Uh oh, can't connect. Invalid dbname, user or password?")
#    print(e)

# root: Render HTML for start menu.
@app.route("/")
def index():
    return render_template("index.html", version=version)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)