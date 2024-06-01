from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
import sqlite3
import uuid
from datetime import datetime, timedelta
import io
import boto3



app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://ec2-3-27-159-85.ap-southeast-2.compute.amazonaws.com"}})
s3_client = boto3.client('s3', region_name='Asia Pacific (Sydney) ap-southeast-2')
BUCKET_NAME = 'libsys'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Ensure this is securely generated and consistent
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'ashwinsheen2906@gmail.com'
app.config['MAIL_PASSWORD'] = 'ndmx wrjh vrhx dotr'
app.config['MAIL_DEFAULT_SENDER'] = 'your-email@example.com'
mail = Mail(app)

def get_db_connection():
    conn = sqlite3.connect('library.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    email = data['email']
    role = data.get('role', 'user')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', (username, password, email, role))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already exists'}), 400
    finally:
        conn.close()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    identifier = data['identifier']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ? OR email = ?', (identifier, identifier))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={'username': user['username'], 'role': user['role']})
        return jsonify(access_token=access_token, user_role=user['role']), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT username, email FROM users WHERE username = ?', (current_user['username'],))
    user = cursor.fetchone()
    conn.close()
    if user:
        return jsonify(dict(user))
    return jsonify({'message': 'User not found'}), 404

@app.route('/api/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.json
    email = data['email']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()

    if user:
        token = str(uuid.uuid4())
        expiration_date = datetime.now() + timedelta(hours=1)
        cursor.execute('INSERT INTO password_reset_tokens (user_id, token, expiration_date) VALUES (?, ?, ?)',
                       (user['id'], token, expiration_date))
        conn.commit()

        reset_link = f"https://ec2-3-27-159-85.ap-southeast-2.compute.amazonaws.com/reset-password?token={token}"
        msg = Message('Password Reset Request', recipients=[email])
        msg.body = f"Hello {user['username']},\n\nTo reset your password, click the following link: {reset_link}\n\nIf you did not request this, please ignore this email."
        mail.send(msg)

        return jsonify({'message': 'Password reset email sent'}), 200

    return jsonify({'message': 'Email not found'}), 404

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    token = data['token']
    new_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT user_id FROM password_reset_tokens WHERE token = ? AND expiration_date > ?',
                   (token, datetime.now()))
    token_data = cursor.fetchone()

    if token_data:
        cursor.execute('UPDATE users SET password = ? WHERE id = ?', (new_password, token_data['user_id']))
        cursor.execute('DELETE FROM password_reset_tokens WHERE token = ?', (token,))
        conn.commit()
        return jsonify({'message': 'Password reset successful'}), 200

    return jsonify({'message': 'Invalid or expired token'}), 400

@app.route('/api/books', methods=['GET'])
@jwt_required()
def get_books():
    query = request.args.get('q', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, title, author, genre, published_date, url FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?', 
                   (f'%{query}%', f'%{query}%', f'%{query}%'))
    books = cursor.fetchall()
    conn.close()
    
    book_data = []
    for book in books:
        url = s3_client.generate_presigned_url('get_object', Params={'Bucket': 'libsys', 'Key': book['url']}, ExpiresIn=3600)
        book_data.append({
            'id': book['id'],
            'title': book['title'],
            'author': book['author'],
            'genre': book['genre'],
            'published_date': book['published_date'],
            'url': url
        })
    
    return jsonify(book_data)


@app.route('/api/books', methods=['POST'])
@jwt_required()
def upload_book():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Only admins can upload books'}), 403

    file = request.files['file']
    metadata = request.form

    s3_key = f"books/{uuid.uuid4()}/{file.filename}"
    s3_client.upload_fileobj(file, 'libsys', s3_key)
    url = s3_client.generate_presigned_url('get_object', Params={'Bucket': 'libsys', 'Key': s3_key}, ExpiresIn=3600)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO books (title, author, genre, published_date, url) VALUES (?, ?, ?, ?, ?)',
                   (metadata['title'], metadata['author'], metadata['genre'], metadata['published_date'], url))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Book uploaded successfully'}), 201    



if __name__ == '__main__':
     app.run()
     