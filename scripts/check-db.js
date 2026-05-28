require('dotenv').config();

const mongoose = require('mongoose');
const { configureMongoDns, getMongoOptions, getMongoUri } = require('../config/mongo');

const models = [
  require('../models/Voter'),
  require('../models/Election'),
  require('../models/Candidate'),
  require('../models/Vote'),
];

async function main() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGO_URI or Railway\'s MONGO_URL variable.');
  }

  configureMongoDns(mongoUri);
  await mongoose.connect(mongoUri, getMongoOptions(mongoUri));

  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  for (const model of models) {
    const count = await model.countDocuments({});
    console.log(`${model.collection.name}: ${count}`);
  }
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
