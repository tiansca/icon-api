const {JsonDB, Config} = require('node-json-db')
var db = new JsonDB(new Config("iconDataBase", true, false, '/'));
module.exports = db
