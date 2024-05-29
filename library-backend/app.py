from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
import uuid
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

def get_db_connection():
    conn = sqlite3.connect('library.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    role = data.get('role', 'user')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', (username, password, role))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username already exists'}), 400
    finally:
        conn.close()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={'username': username, 'role': user['role']})
        return jsonify(access_token=access_token), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.json
    username = data['username']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()

    if user:
        token = str(uuid.uuid4())
        expiration_date = datetime.now() + timedelta(hours=1)
        cursor.execute('INSERT INTO password_reset_tokens (user_id, token, expiration_date) VALUES (?, ?, ?)',
                       (user['id'], token, expiration_date))
        conn.commit()

        # Here you would send the token to the user's email. For simplicity, we'll just return it.
        return jsonify({'token': token}), 200

    return jsonify({'message': 'User not found'}), 404

@app.route('/reset-password', methods=['POST'])
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

@app.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    query = request.args.get('q', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?', 
                   (f'%{query}%', f'%{query}%', f'%{query}%'))
    books = cursor.fetchall()
    conn.close()
    return jsonify([dict(book) for book in books])

@app.route('/books/<int:book_id>/download', methods=['GET'])
@jwt_required()
def download_book(book_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM books WHERE id = ?', (book_id,))
    book = cursor.fetchone()
    conn.close()
    if book:
        return send_from_directory(directory=os.path.dirname(book['file_path']), 
                                   filename=os.path.basename(book['file_path']), 
                                   as_attachment=True)
    return jsonify({'message': 'Book not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
