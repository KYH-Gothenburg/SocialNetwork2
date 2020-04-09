var express = require('express');
var router = express.Router();
var da_users = require('../data_access/da_users');
var da_message = require('../data_access/da_message');

const rdl = (req, res, next) => {
    if(!req.session['userid']) {
        res.redirect('/login');
    }
    else {
        next();
    }
};

router.get('/',rdl, function(req, res, next) {
    da_users.getUserById(req.session['userid'], function(err, user) {
        da_users.getFriendsOfUser(user, function(friends) {
            da_message.getUnreadCount(user._id, function(err, unreadCount) {

                res.render('dashboard', {
                    title: 'Dashboard of ' + user.first_name,
                    user: user,
                    userid: user._id,
                    friends: friends, 
                    unreadCount: unreadCount
                });
            });

        });
    });
});

module.exports = router;