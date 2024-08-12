// test/register.test.js

const { connectDB, disconnectDB, loadModules, getExpect } = require('./setup');
const User = require('../models/user'); // Adjust the path according to your project structure

describe('User Registration', function () {
    before(async function () {
        await loadModules();
        await connectDB();
    });

    after(async function () {
        await disconnectDB();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });

    it('should register a new user', async function () {
        const expect = getExpect();
        const user = new User({
            username: 'testuser',
            passwordHash: 'hashedpassword123',
            passwordSalt: 'somesalt',
        });
        const savedUser = await user.save();

        // Log the saved user to debug
        console.log(savedUser);

        expect(savedUser.username).to.equal('testuser');
    });
});
