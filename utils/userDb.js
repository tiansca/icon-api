const {JsonDB, Config} = require('node-json-db')
var userDB = new JsonDB(new Config("userDataBase", true, false, '/'));
module.exports = userDB
