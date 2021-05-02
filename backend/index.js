import mongodb from 'mongodb';
import dotenv from 'dotenv';
// eslint-disable-next-line import/extensions
import restaurantsDao from './dao/restaurantsDao.js';
// eslint-disable-next-line import/extensions
import reviewsDao from './dao/reviewsDao.js';
// eslint-disable-next-line import/extensions
import app from './server.js';

dotenv.config();

const { MongoClient } = mongodb;
const PORT = process.env.PORT || 8000;

MongoClient.connect(process.env.CONNECTURL, {
  poolSize: process.env.POOLSIZE || 20,
  wtimeout: process.env.WTIMEOUT || 1500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    j: true,
  },
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
}).then(async (client) => {
  await restaurantsDao.injectDB(client);
  await reviewsDao.injectDB(client);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`listening on port ${PORT}`);
  });
});
