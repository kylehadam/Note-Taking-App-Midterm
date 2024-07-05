document.addEventListener('DOMContentLoaded', () => {
   const noteForm = document.getElementById('note-form');
   const noteList = document.getElementById('note-list');

   async function fetchNotes() {
      const response = await fetch('/api/notes');
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
   }

   noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;

      const response = await fetch('/api/notes', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ title, content, user: '12345' }) // Replace '12345' with dynamic user ID
      });

      if (response.ok) {
         fetchNotes();
      }
   });

   fetchNotes();
});

async function deleteNote(id) {
   const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE'
   });

   if (response.ok) {
      fetchNotes();
   }
}
