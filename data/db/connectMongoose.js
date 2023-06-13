const mongoose = require("mongoose");

const configConnection = {
    database: 'mongodb',
    host: '127.0.0.1',
    port: '27017',
    dbName: 'Blog',
  };
  
const url = `${configConnection.database}://${configConnection.host}:${configConnection.port}/${configConnection.dbName}`;
const connectMongoose = async () => {
    await mongoose.connect(url);
    console.log(`Connected to MongoDb via mongoose successfully, url: ${url}`);
};

module.exports = connectMongoose;
