# Note-Taking App Midterm

This is a Note-Taking App created for a midterm project. The app allows users to register, log in, create, view, and delete notes. It uses MongoDB for data storage, Express.js for the backend, and a simple frontend with HTML, CSS, and JavaScript.

## Features

- User registration
- User login with session management
- Create, view, and delete notes
- Secure password storage using `crypto.pbkdf2`

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Crypto module
- connect-mongo
- HTML, CSS, JavaScript

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kylehadam/Note-Taking-App-Midterm.git
   cd Note-Taking-App-Midterm


## Environment Variables
Create a `.env` file in the root directory of the project and add the following:

```plaintext
MONGO_URI=mongodb://localhost:27017/note-taking-app
PORT=3000
SESSION_SECRET=your_random_secret_key

How to Use the App
Register a New User:

Open your browser and navigate to http://127.0.0.1:3000.
You will see the registration form. Fill in the Username and Password fields and click on the Register button.
A message will appear confirming your registration. You can now log in.
Log In with an Existing User:

After registering, you will be redirected to the login form.
Enter your Username and Password and click on the Login button.
Upon successful login, you will be redirected to the note-taking interface.
Create a New Note:

Once logged in, you will see the note-taking interface.
Fill in the Title and Content fields and click on the Add Note button.
Your new note will appear in the list of notes.
View Notes:

All notes created by the logged-in user will be displayed in the note list.
You can view the title and content of each note.
Delete a Note:

Each note in the list will have a Delete button.
Click the Delete button to remove the note from the list and the database.
Log Out:

Click the Logout button to log out of the application.
You will be redirected to the login page.

API Endpoints
Authentication

Register User
POST /auth/register

Request Body:
json
{
  "username": "your_username",
  "password": "your_password"
}

Login User
POST /auth/login

Request Body:
json
{
  "username": "your_username",
  "password": "your_password"
}

Logout User
GET /auth/logout

Notes
Get All Notes
GET /api/notes

Create Note
POST /api/notes

Request Body:
json
{
  "title": "Note title",
  "content": "Note content"
}
Delete Note
DELETE /api/notes/:id

Usage
1. Register a new user using the registration form.
2. Login with the registered user credentials.
3. Create new notes after logging in.
4. View all notes associated with the logged-in user.
5. Delete notes as needed.

Additional Information
The app uses passport-local for local authentication and crypto.pbkdf2 for secure password hashing.
Sessions are managed using express-session and stored in MongoDB using connect-mongo.

License
This project is licensed under the MIT License.

Replace `<USERNAME>` with your GitHub username in the clone command.

This README file should provide clear instructions and an overview of the project based on the latest code and configurations.





