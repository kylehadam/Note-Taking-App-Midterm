// test/setup.js

const mongoose = require('mongoose');
const sinon = require('sinon');

let chai;
let chaiAsPromised;
let expect;

async function loadModules() {
    chai = await import('chai');
    chaiAsPromised = await import('chai-as-promised');
    chai.use(chaiAsPromised.default);
    expect = chai.expect;
}

async function connectDB() {
    await mongoose.connect('mongodb://localhost:27017/testdb', {});
    console.log('Connected to MongoDB');
}

async function disconnectDB() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

module.exports = {
    connectDB,
    disconnectDB,
    loadModules,
    getExpect() {
        return expect;
    },
    sinon
};
