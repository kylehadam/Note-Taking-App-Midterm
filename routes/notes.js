const express = require('express');
const router = express.Router();
const Note = require('../models/note');
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
  const { title, content, tags, priority } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      tags,
      priority,
      user: req.user.id
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /api/notes/:id
// @desc     Get a note by ID
// @access   Private
router.get('/notes/:id', ensureAuthenticated, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT /api/notes/:id
// @desc     Update a note
// @access   Private
router.put('/notes/:id', ensureAuthenticated, async (req, res) => {
  const { title, content, tags, priority } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update only if there are changes
    let updatedFields = {};
    if (note.title !== title) updatedFields.title = title;
    if (note.content !== content) updatedFields.content = content;
    if (note.tags.join(',') !== tags.join(',')) updatedFields.tags = tags;
    if (note.priority !== priority) updatedFields.priority = priority;

    if (Object.keys(updatedFields).length > 0) {
      updatedFields.updatedAt = Date.now(); // Update the modified date only if changes are made
      await Note.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
    }

    res.json({ msg: 'Note updated', note: { ...note._doc, ...updatedFields } });
  } catch (err) {
    console.error('Error updating note:', err.message);
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
