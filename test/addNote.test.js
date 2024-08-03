// test/addNote.test.js

const { connectDB, disconnectDB, loadModules, getExpect } = require('./setup');
const Note = require('../models/Note'); // Adjust the path according to your project structure
const User = require('../models/User'); // Adjust the path according to your project structure

describe('Add Note', function () {
    before(async function () {
        await loadModules();
        await connectDB();
    });

    after(async function () {
        await disconnectDB();
    });

    beforeEach(async function () {
        await User.deleteMany({});
        await Note.deleteMany({});
    });

    it('should add a note for an existing user', async function () {
        const expect = getExpect();
        const user = new User({
            username: 'testuser',
            passwordHash: 'hashedpassword123',
            passwordSalt: 'somesalt',
            email: 'testuser@example.com'
        });
        await user.save();

        const note = new Note({
            userId: user._id,
            title: 'Test Note',
            content: 'This is a test note',
            user: user._id, // Assuming 'user' is a reference to the User model
            priority: 'Low' // Correct enum value
        });
        const savedNote = await note.save();
        expect(savedNote.title).to.equal('Test Note');
        expect(savedNote.content).to.equal('This is a test note');
    });
});
