from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import sys
from reddit_crawler import *

app = Flask(__name__)
CORS(app)


@app.route("/get_rate", methods=['GET'])
def get_rate():
    name = request.args.get('name')
    if not name:
        return "error input"
    return jsonify(tagDownload(name))


if __name__ == '__main__':
    app.run()
