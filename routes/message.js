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


router.get('/', rdl, function(req, res, next) {
    da_users.getAllUsers(function(err, users) {
        res.render('message', {title: 'Send Message', users: users, userid: req.session.userid});
    });
});

router.post('/', rdl, function(req, res, next) {
    da_message.sendMessage( {
        from: req.session.userid,
        to: req.body.to,
        title: req.body.title,
        date: new Date(),
        body: req.body.body,
        read: false
    }, function(err) {
        res.render('message_sent', {
            title: "Message Sent",
            message_title: req.body.title,
            userid: req.session.userid
        });
    });
});


module.exports = router;