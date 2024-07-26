const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { ensureAuthenticated } = require('../config/auth');

// @route    GET /api/notes
// @desc     Get all notes for the logged-in user
// @access   Private
router.get('/notes', ensureAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/notes
// @desc     Create a new note
// @access   Private
router.post('/notes', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      user: req.user.id
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE /api/notes/:id
// @desc     Delete a note
// @access   Private
router.delete('/notes/:id', ensureAuthenticated, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    await Note.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
