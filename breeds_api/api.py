from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import label_image
import json, os

app  = Flask(__name__)

CORS(app)
app.config['CORS_HEADERS']  = 'Content-Type'
app.config['UPLOAD_FOLDER'] = 'upload/'

root   = os.path.dirname(os.path.abspath(__file__))
target = os.path.join(root, 'upload')

cors   = CORS(app, resources = {r'/api/*': {'origins': 'http://localhost:8080'}})
graph  = label_image.load_graph('tf/retrained_graph.pb')
labels = label_image.load_labels('tf/retrained_labels.txt')


@app.route('/api')
def index():
  return 'Root api point for dogs breeds classification. Go to labels'

@app.route('/api/labels', methods=['POST'])
@cross_origin(origin='*')
def post_labels():
  f = request.files['dog_image']
  f_name = f.filename

  path = os.path.join(target, f_name);
  f.save(path)

  classified = label_image.classify_image(path, graph, labels)

  os.remove(path)

  return json.dumps({'prediction': classified, 'filename': f_name})

app.run(debug = True)