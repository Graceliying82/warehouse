const Config = require('../config/config')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

function connect(url) {
  return MongoClient.connect(url,  { useNewUrlParser: true }).then(client => client.db(Config.dbname))
}

module.exports = async function () {
  try {
    return await connect(Config.dburl)
  } catch (err) {
    assert.equal(null, err);
    console.error('Failed to make all database connections!')
    process.exit(1)
  }
}
