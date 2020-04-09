const Message = require("../models/message");
const mongoose = require("mongoose");

function connect2db() {
  mongoose.connect("mongodb://localhost:27017/social_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection
    .once("open", function() {
      console.log("Connection to MongoDB made...");
    })
    .on("error", function(error) {
      console.log("Error connecting to MongoDB. Error:", error);
    });
}

function sendMessage(m, cb) {
    connect2db();
    let message = new Message(m);
    message.save(function(err) {
        cb(err);
    });
}

module.exports = {
    sendMessage: sendMessage
}