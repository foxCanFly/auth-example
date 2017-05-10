const mongoose = require('mongoose');

const models = require('./models');
const log = require('../../log');


function createMongoDataStore(config) {
  const uri = config.uri;

  mongoose.Promise = Promise;
  mongoose.connect(uri);

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  const db = mongoose.connection;

  db.on('error', () => { log.error(`Get Mongo/Mongoose error: ${err}`); });
  db.once('open', () => { log.info(`Mongoose is successfully connected to Mongo uri: ${uri}`) });

  return models;
}

module.exports = createMongoDataStore;