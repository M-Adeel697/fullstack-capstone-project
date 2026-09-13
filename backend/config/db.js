const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
let dbInstance = null;

const connectToDatabase = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const client = new MongoClient(url);

  await client.connect();

  dbInstance = client.db();
  return dbInstance;
};

module.exports = connectToDatabase;
