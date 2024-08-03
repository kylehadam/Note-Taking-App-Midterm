// test/retrieveNotes.test.js

const { connectDB, disconnectDB, loadModules, getExpect } = require('./setup');
const Note = require('../models/Note'); // Adjust the path according to your project structure
const User = require('../models/User'); // Adjust the path according to your project structure

describe('Retrieve Notes', function () {
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

    it('should retrieve notes for an existing user', async function () {
        const expect = getExpect();
        const user = new User({
            username: 'testuser',
            passwordHash: 'hashedpassword123',
            passwordSalt: 'somesalt'
        });
        await user.save();

        const note1 = new Note({
            user: user._id,
            title: 'Test Note 1',
            content: 'This is a test note 1',
            tags: ['test'],
            priority: 'Low'
        });
        const note2 = new Note({
            user: user._id,
            title: 'Test Note 2',
            content: 'This is a test note 2',
            tags: ['test'],
            priority: 'Low'
        });
        const savedNote1 = await note1.save();
        const savedNote2 = await note2.save();

        // Log the saved notes and user to debug
        console.log(savedNote1, savedNote2, user);

        const notes = await Note.find({ user: user._id });

        // Log the retrieved notes to debug
        console.log(notes);

        expect(notes).to.have.lengthOf(2);
        expect(notes[0].title).to.equal('Test Note 1');
        expect(notes[1].title).to.equal('Test Note 2');
    });
});
