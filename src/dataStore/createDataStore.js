const createMongoDataStore = require('./mongo/createDataStore');
const log = require('../log');


async function createDataStore(config) {
  try {
    if (config.mongo) {
      return createMongoDataStore(config.mongo);
    }

    log.error(`dataStore: can not create dataStore. Type section is not specified.`);
  } catch(err) {
    log.error(`dataStore: can not create dataStore with parameters: ${config}. Got error: ${err}`);
  }
}

module.exports = createDataStore;
