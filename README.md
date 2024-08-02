Note-Taking App Midterm

This is a Note-Taking App created for a midterm project. The app allows users to register, log in, create, view, and delete notes. It uses MongoDB for data storage, Express.js for the backend, and a simple frontend with HTML, CSS, and JavaScript.

Features
User registration
User login with session management
Create, view, and delete notes
Secure password storage using crypto.pbkdf2
Technologies Used
Node.js
Express.js
MongoDB
Mongoose
Passport.js
Crypto modulenpm
connect-mongo
HTML, CSS, JavaScript
Installation
Clone the repository:

git clone https://github.com/kylehadam/Note-Taking-App-Midterm.git
cd Note-Taking-App-Midterm

Install dependencies:

npm install

Create a .env file in the root directory of the project and add the following:

MONGO_URI=mongodb://localhost:27017/note-taking-app
PORT=3000
SESSION_SECRET=your_random_secret_key

Start the server:

npm start

How to Use the App

Register a New User
Open your browser and navigate to http://127.0.0.1:3000.
Fill in the Username and Password fields in the registration form and click on the Register button.
A message will appear confirming your registration. You can now log in.

Log In with an Existing User
After registering, you will be redirected to the login form.
Enter your Username and Password and click on the Login button.
Upon successful login, you will be redirected to the note-taking interface.

Create a New Note
Once logged in, you will see the note-taking interface.
Fill in the Title and Content fields and click on the Add Note button.
Your new note will appear in the list of notes.

View Notes
All notes created by the logged-in user will be displayed in the note list.
You can view the title and content of each note.

Delete a Note
Each note in the list will have a Delete button.
Click the Delete button to remove the note from the list and the database.

Log Out
Click the Logout button to log out of the application.
You will be redirected to the login page.

API Endpoints
Authentication

Register User
Endpoint: POST /auth/register

Request Body:

{
"username": "your_username",
"password": "your_password"
}

Login User
Endpoint: POST /auth/login

Request Body:

{
"username": "your_username",
"password": "your_password"
}

Logout User
Endpoint: GET /auth/logout

Notes
Get All Notes
Endpoint: GET /api/notes

Create Note
Endpoint: POST /api/notes

Request Body:

{
"title": "Note title",
"content": "Note content"
}

Delete Note
Endpoint: DELETE /api/notes/:id

Usage
Register a new user using the registration form.
Log in with the registered user credentials.
Create new notes after logging in.
View all notes associated with the logged-in user.
Delete notes as needed.

Additional Information
The app uses passport-local for local authentication and crypto.pbkdf2 for secure password hashing.
Sessions are managed using express-session and stored in MongoDB using connect-mongo.

License
This project is licensed under the MIT License.


