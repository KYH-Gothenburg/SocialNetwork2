const Message = require("../models/message");
const Person = require("../models/person");
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

function getUnreadCount(id, cb) {
    connect2db();
    Message.find({to: id, read: false}, function(err, messages) {
        cb(err, messages.length);
    });
}

function getAllMessagesForId(id, cb) {
    connect2db();
    Message.find({to: id}, function(err, messages) {
        cb(err, messages);
    });
}

function getSenderForMessages(messages, cb) {
    connect2db();
    let counter = 0;
    messages.forEach(function(message) {
      Person.findOne({_id: message.from}, function(err, person){
        counter++;
        console.log(person);
        message.from = person.first_name + " " + person.last_name;
        if(counter === messages.length) {
          cb(messages);
        }
      });
    });
}


module.exports = {
    sendMessage: sendMessage,
    getUnreadCount: getUnreadCount,
    getAllMessagesForId: getAllMessagesForId,
    getSenderForMessages: getSenderForMessages
}