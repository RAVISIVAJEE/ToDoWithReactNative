from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to a real secret key
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    tasks = db.relationship('Task', backref='user', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed
        }

# Authentication routes
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify(message="Username and password required"), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify(message="Invalid credentials"), 401

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify(message="Username and password required"), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify(message="Username already exists"), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.id)
    return jsonify(access_token=access_token), 201

# Task routes with authentication
@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks', methods=['POST'])
@jwt_required()
def add_task():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Text field is required'}), 400

    current_user_id = get_jwt_identity()
    new_task = Task(text=data['text'], user_id=current_user_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    data = request.json
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first_or_404()

    if 'text' in data:
        task.text = data['text']
    if 'completed' in data:
        task.completed = data['completed']
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    # Initialize database if needed
    with app.app_context():
        db.create_all()
    app.run(debug=True)
