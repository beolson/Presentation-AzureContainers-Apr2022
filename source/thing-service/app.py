
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils.functions import database_exists, create_database
from flask_cors import CORS
import sqlalchemy
import os
from sqlalchemy import create_engine


app = Flask(__name__)
CORS(app)

db_password = os.getenv('DB_PASSWORD', 'Your_password123')
db_user = os.getenv('DB_USER', 'sa')
db_server = os.getenv('DB_SERVER', 'db:1433')
db_database = os.getenv('DB_DATABASE', 'things')
app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc://{db_user}:{db_password}@{db_server}/{db_database}?driver=ODBC+Driver+17+for+SQL+Server"
print('*******************************************************************')
print(app.config['SQLALCHEMY_DATABASE_URI'])
print('*******************************************************************')

if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        create_database(app.config['SQLALCHEMY_DATABASE_URI'])

db = SQLAlchemy(app)
class Thing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(80), unique=False, nullable=False)

    def __init__(self, value):
        self.value = value

    def json(self):
        return {'id': self.id, 'value': self.value}

    def __repr__(self):
        return f"<Thing id='{self.id}' value='{self.value}' />"

if not sqlalchemy.inspect(db.engine).has_table("Thing"):
    # do stuff
    db.create_all()
    testThing = Thing(value='Test Thing')
    db.session.add(testThing)
    db.session.commit()

#create thing
@app.route('/api/thing', methods=['POST'])
def create_things():
    data = request.get_json()
    new_thing = Thing(data["value"])
    db.session.add(new_thing)
    db.session.commit()
    return make_response(Thing.json(new_thing), 200)

# get all things
@app.route('/api/thing', methods=['GET'])
def get_things():
    return make_response(jsonify([Thing.json(movie) for movie in Thing.query.all()]), 200)



app.run()