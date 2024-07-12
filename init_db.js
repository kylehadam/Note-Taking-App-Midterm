const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'note-taking-app';

async function main() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Drop the database if it exists
    await db.dropDatabase();
    console.log(`Database ${dbName} dropped`);

    // Create collections
    const usersCollection = db.collection('users');
    const notesCollection = db.collection('notes');

    // Insert sample data
    const userResult = await usersCollection.insertOne({ username: 'testuser', password: 'password123' });
    console.log('User inserted with id:', userResult.insertedId);

    await notesCollection.insertOne({ title: 'Sample Note', content: 'This is a sample note', user: userResult.insertedId });
    console.log('Sample note inserted');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
