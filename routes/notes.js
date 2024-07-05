const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// @route    GET /api/notes
// @desc     Get all notes
// @access   Public
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/notes
// @desc     Create a new note
// @access   Public
router.post('/notes', async (req, res) => {
  const { title, content, user } = req.body;
  console.log('Received POST request to create a note:', req.body);

  try {
    const newNote = new Note({
      title,
      content,
      user
    });

    const note = await newNote.save();
    console.log('Note successfully created:', note);
    res.json(note);
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE /api/notes/:id
// @desc     Delete a note
// @access   Public
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
