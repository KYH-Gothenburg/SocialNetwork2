const Person = require("../models/person");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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

function save(p, cb) {
    connect2db();
    var person = new Person(p);
    bcrypt.hash(person.password, 10, function(err, hash) {
        person.password = hash;
        person.save(function(err) {
            if(err) {
                console.log("Error saving user " + err);
            }
            cb(err);
        });
    });
}

function getAllUsers(cb) {
    connect2db();
    Person.find(function (err, users) {
        if(err) {
            console.log('Error getting users ' + err);
        }
        cb(err, users);
    });
}

function getUserByUsername(username, cb) {
    connect2db();
    Person.findOne({username: username}, function(err, user) {
        cb(err, user);
    });
}

module.exports = {
    save: save,
    getAllUsers: getAllUsers, 
    getUserByUsername: getUserByUsername
}
