document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const noteList = document.getElementById('note-list');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');
  const noteApp = document.getElementById('note-app');
  const userSection = document.getElementById('user-section');
  const errorDisplay = document.createElement('div'); // Element to display errors

  errorDisplay.style.color = 'red';
  userSection.appendChild(errorDisplay);

  function sanitizeInput(input) {
    return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  }

  async function fetchNotes() {
    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to fetch notes: ${errorMsg}`);
      }
      const notes = await response.json();
      noteList.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
          <h2>${note.title}</h2>
          <p>${note.content}</p>
          <button onclick="deleteNote('${note._id}')">Delete</button>
        `;
        noteList.appendChild(noteElement);
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      errorDisplay.textContent = 'Error fetching notes: ' + error.message;
    }
  }

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = sanitizeInput(document.getElementById('title').value);
    const content = sanitizeInput(document.getElementById('content').value);

    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to create note: ${errorMsg}`);
      }
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      errorDisplay.textContent = 'Error creating note: ' + error.message;
    }
  });

  window.deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to delete note: ${errorMsg}`);
      }
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      errorDisplay.textContent = 'Error deleting note: ' + error.message;
    }
  };

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = sanitizeInput(document.getElementById('register-username').value);
    const password = sanitizeInput(document.getElementById('register-password').value);

    if (username === "" || password === "") {
      errorDisplay.textContent = 'Username and password cannot be empty';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg.msg || 'Failed to register');
      }
      alert('Registration successful. Please login.');
    } catch (error) {
      console.error('Error registering user:', error);
      errorDisplay.textContent = 'Error registering user: ' + error.message;
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = sanitizeInput(document.getElementById('login-username').value);
    const password = sanitizeInput(document.getElementById('login-password').value);

    if (username === "" || password === "") {
      errorDisplay.textContent = 'Username and password cannot be empty';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg.msg || 'Failed to login');
      }
      userSection.style.display = 'none';
      noteApp.style.display = 'block';
      logoutButton.style.display = 'block';
      fetchNotes();
    } catch (error) {
      console.error('Error logging in:', error);
      errorDisplay.textContent = 'Error logging in: ' + error.message;
    }
  });

  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to logout: ${errorMsg}`);
      }
      userSection.style.display = 'block';
      noteApp.style.display = 'none';
      logoutButton.style.display = 'none';
    } catch (error) {
      console.error('Error logging out:', error);
      errorDisplay.textContent = 'Error logging out: ' + error.message;
    }
  });

  // Do not call fetchNotes() on initial load
});
