document.addEventListener('DOMContentLoaded', () => {
  const apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port || ''}`;

  const noteForm = document.getElementById('note-form');
  const editNoteForm = document.getElementById('edit-note-form');
  const noteList = document.getElementById('note-list');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');
  const noteApp = document.getElementById('note-app');
  const userSection = document.getElementById('user-section');
  const errorDisplay = document.createElement('div'); 
  const homeSection = document.getElementById('home-section');
  const addNoteSection = document.getElementById('add-note-section');
  const editNoteSection = document.getElementById('edit-note-section');
  const myNotesSection = document.getElementById('my-notes-section');
  const homeLink = document.getElementById('home-link');
  const addNoteLink = document.getElementById('add-note-link');
  const myNotesLink = document.getElementById('my-notes-link');

  errorDisplay.style.color = 'red';
  userSection.appendChild(errorDisplay);

  function sanitizeInput(input) {
    return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  }

  function showSection(section) {
    homeSection.style.display = 'none';
    addNoteSection.style.display = 'none';
    editNoteSection.style.display = 'none';
    myNotesSection.style.display = 'none';
    section.style.display = 'block';
  }

  homeLink.addEventListener('click', () => showSection(homeSection));
  addNoteLink.addEventListener('click', () => showSection(addNoteSection));
  myNotesLink.addEventListener('click', () => {
    showSection(myNotesSection);
    fetchNotes();
  });

  async function fetchNotes() {
    try {
      const response = await fetch(`${apiBaseUrl}/api/notes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' 
      });
      if (!response.ok) throw new Error(`Failed to fetch notes: ${await response.text()}`);
      const notes = await response.json();
      noteList.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
          <h2>${note.title}</h2>
          <p>${note.content}</p>
          <div class="meta">
            <span>Created: ${new Date(note.createdAt).toLocaleString()}</span>
            <span>Modified: ${new Date(note.updatedAt).toLocaleString()}</span>
          </div>
          <div class="meta">
            <span>Tags: ${note.tags.join(', ')}</span>
            <span>Priority: ${note.priority}</span>
          </div>
          <div class="actions">
            <button onclick="editNote('${note._id}')">Edit</button>
            <button onclick="deleteNote('${note._id}')">Delete</button>
            <button onclick="copyAndEdit('${note._id}')">Copy and Edit</button>
          </div>
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
    const tags = sanitizeInput(document.getElementById('tags').value).split(',').map(tag => tag.trim());
    const priority = sanitizeInput(document.getElementById('priority').value);

    try {
      const response = await fetch(`${apiBaseUrl}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, priority }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to create note: ${await response.text()}`);
      fetchNotes();
      showSection(myNotesSection);
      noteForm.reset();
    } catch (error) {
      console.error('Error creating note:', error);
      errorDisplay.textContent = 'Error creating note: ' + error.message;
    }
  });

  editNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = sanitizeInput(document.getElementById('edit-title').value);
    const content = sanitizeInput(document.getElementById('edit-content').value);
    const tags = sanitizeInput(document.getElementById('edit-tags').value).split(',').map(tag => tag.trim());
    const priority = sanitizeInput(document.getElementById('edit-priority').value);
    const noteId = editNoteForm.dataset.noteId;

    try {
      const response = await fetch(`${apiBaseUrl}/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, priority }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to update note: ${await response.text()}`);
      fetchNotes();
      showSection(myNotesSection);
      editNoteForm.reset();
      delete editNoteForm.dataset.noteId;
    } catch (error) {
      console.error('Error updating note:', error);
      errorDisplay.textContent = 'Error updating note: ' + error.message;
    }
  });

  window.deleteNote = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to delete note: ${await response.text()}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      errorDisplay.textContent = 'Error deleting note: ' + error.message;
    }
  };

  window.editNote = async (id) => {
    const note = await fetchNoteById(id);
    if (note) {
      showSection(editNoteSection);
      document.getElementById('edit-title').value = note.title;
      document.getElementById('edit-content').value = note.content;
      document.getElementById('edit-tags').value = note.tags.join(', ');
      document.getElementById('edit-priority').value = note.priority;
      editNoteForm.dataset.noteId = id;
    }
  };

  window.copyAndEdit = async (id) => {
    const note = await fetchNoteById(id);
    if (note) {
      showSection(addNoteSection);
      document.getElementById('title').value = note.title;
      document.getElementById('content').value = note.content;
      document.getElementById('tags').value = note.tags.join(', ');
      document.getElementById('priority').value = note.priority;
    }
  };

  async function fetchNoteById(id) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/notes/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to fetch note: ${await response.text()}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching note:', error);
      errorDisplay.textContent = 'Error fetching note: ' + error.message;
      return null;
    }
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = sanitizeInput(document.getElementById('register-username').value);
    const password = sanitizeInput(document.getElementById('register-password').value);

    if (!username || !password) {
      errorDisplay.textContent = 'Username and password cannot be empty';
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error((await response.json()).msg || 'Failed to register');
      alert('Registration successful. Please login.');
      registerForm.reset();
    } catch (error) {
      console.error('Error registering user:', error);
      errorDisplay.textContent = 'Error registering user: ' + error.message;
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = sanitizeInput(document.getElementById('login-username').value);
    const password = sanitizeInput(document.getElementById('login-password').value);

    if (!username || !password) {
      errorDisplay.textContent = 'Username and password cannot be empty';
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error((await response.json()).msg || 'Failed to login');
      userSection.style.display = 'none';
      noteApp.style.display = 'flex';
      showSection(homeSection);
      loginForm.reset();
    } catch (error) {
      console.error('Error logging in:', error);
      errorDisplay.textContent = 'Error logging in: ' + error.message;
    }
  });

  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to logout: ${await response.text()}`);
      userSection.style.display = 'block';
      noteApp.style.display = 'none';
    } catch (error) {
      console.error('Error logging out:', error);
      errorDisplay.textContent = 'Error logging out: ' + error.message;
    }
  });

  if (document.cookie.includes('connect.sid')) {
    userSection.style.display = 'none';
    noteApp.style.display = 'flex';
    showSection(homeSection);
  }
});
