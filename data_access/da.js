const Person = require("../models/person");
const mongoose = require("mongoose");

function connect2db() {
  mongoose.connect("mongodb://localhost:27017/python_db", {
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

function search(pattern, cb) {
    connect2db();
    Person.find(
      {
        $or: [
          { first_name: { $regex: pattern } },
          { last_name: { $regex: pattern } }
        ]
      },
      function(err, persons) {
        cb(err, persons);
      }
    );
  }

  function savePerson(p, cb) {
    connect2db();
    let person = new Person(p);
    person.save(function(err) {
      cb(err);
    });
  }

  module.exports = {
      search:search, 
      savePerson: savePerson
  }