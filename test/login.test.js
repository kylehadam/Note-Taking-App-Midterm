// test/login.test.js

const { connectDB, disconnectDB, loadModules, getExpect } = require('./setup');
const User = require('../models/user'); // Adjust the path according to your project structure

describe('User Login', function () {
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

    it('should log in an existing user', async function () {
        const expect = getExpect();
        const user = new User({
            username: 'testuser',
            passwordHash: 'hashedpassword123',
            passwordSalt: 'somesalt',
            email: 'testuser@example.com'
        });
        await user.save();

        const foundUser = await User.findOne({ username: 'testuser' });
        expect(foundUser).to.not.be.null;
        expect(foundUser.username).to.equal('testuser');
    });
});
