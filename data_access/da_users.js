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

function getUserById(id, cb) {
    connect2db();
    Person.findOne({_id: id}, function(err, user) {
        cb(err, user);
    });
}


function getFriendsOfUser(user, cb) {
    connect2db();
    let friends_ids = user.friends;
    if(friends_ids.length === 0) {
        cb([]);
    }
    let friends = [];
    let count = 0;
    let friends_to_remove = [];
    friends_ids.forEach(function(id) {
        getUserById(id, function(err, friend) {
            if(friend) {
              friends.push(friend);
            }
            else {
                friends_to_remove.push(id);
            }
            count++;  
            
            if(count === friends_ids.length) {
                friends_to_remove.forEach(function(id) {
                    removeFriend(user.id, id, function(){});
                });
                cb(friends);
            }
        });
    });
}

function removeFriend(user_id, friend_id, cb) {
    connect2db();
    Person.findOneAndUpdate({_id: user_id}, {$pull: {friends: friend_id}}, function(err) {
        cb(err);
    })
}

function addFriend(userid, friendid, cb) {
    connect2db();
    Person.findOneAndUpdate({_id: userid}, {$push: {friends: friendid}}, upsert=false, function(err) {
        Person.findOneAndUpdate({_id: friendid}, {$push: {friends: userid}}, upsert=false, function(err) {
            cb(err);
        });
    });
}

function deleteUser(id, cb) {
    connect2db();
    Person.deleteOne({_id: id}, function(err) {
        cb(err);
    });
}

module.exports = {
    save: save,
    getAllUsers: getAllUsers, 
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    getFriendsOfUser: getFriendsOfUser,
    addFriend: addFriend,
    deleteUser: deleteUser
}
