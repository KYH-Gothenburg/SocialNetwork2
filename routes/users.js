var express = require('express');
var router = express.Router();
var da_users = require('../data_access/da_users');
var da_message = require('../data_access/da_message');

router.get('/', function(req, res, next) {
  da_users.getAllUsers(function (err, users) {
    let userid = req.session['userid'];
    if(userid) {
      da_users.getUserById(userid, function(err, user) {

        da_message.getUnreadCount(userid, function(err, unreadCount) {
          res.render('users/users', {
            title: 'Users', 
            user_list: users, 
            userid: userid,
            friends: user.friends,
            unreadCount: unreadCount
          });
        });
      });
    }
    else {
      res.render('users/users', {
        title: 'Users', 
        user_list: users, 
        userid: userid,
        friends: []
      });
    }
  });
});
router.get('/add_friend', function(req, res, next) {
  da_users.addFriend(req.session['userid'], req.query.id, function(err){
    res.redirect('/users');
  });
});

router.get('/delete', function(req, res, next) {
  da_users.deleteUser(req.query.id, function(err) {
    res.redirect('/users');
  });
});

router.get('/add', function(req, res, next) {
  da_message.getUnreadCount(req.session.userid, function(err, unreadCount) {
    res.render('users/add', {title: 'Add user', userid: req.session['userid'], unreadCount: unreadCount});
  });
});

router.post('/add', function(req, res, next) {
  console.log('Add');
  da_users.save({
    first_name: req.body['first_name'],
    last_name: req.body['last_name'],
    email: req.body['email'],
    username: req.body['username'],
    password: req.body['password'],
    birthyear: req.body['birthyear'],
    avatar: req.body['avatar']
  }, function(err) {
    da_users.getAllUsers(function (err, users) {
      da_users.getUserById(req.session['userid'], function(err, user) {
        res.render('users/users', {
          title: 'Users', 
          user_list: users,
          userid: req.session['userid'],
          friends: user.friends
        });
      });
    });
  })
});

module.exports = router;
