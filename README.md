# Note-Taking App Midterm

## Description
A simple note-taking app built using the MERN stack (MongoDB, Express, React, Node.js) for the UBC Software Development Bootcamp midterm project. This app allows users to register, log in, create, view, and delete notes.

## Features
- User registration and authentication
- Create, view, and delete notes
- Session management using MongoDB

## Prerequisites
- Node.js and npm
- MongoDB

## Environment Variables
Create a `.env` file in the root directory of the project and add the following:

```plaintext
MONGO_URI=mongodb://localhost:27017/note-taking-app
PORT=3000
SESSION_SECRET=your_random_secret_key
