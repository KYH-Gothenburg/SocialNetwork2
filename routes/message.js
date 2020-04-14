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
        da_message.getUnreadCount(req.session.userid, function(err, unreadCount) {

            res.render('message', {title: 'Send Message', users: users, userid: req.session.userid, unreadCount: unreadCount});
        });
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


router.get('/inbox', rdl, function(req, res, next) {
    let userid = req.session.userid;
    da_message.getUnreadCount(req.session.userid, function(err, unreadCount) {
        da_message.getAllMessagesForId(userid, function(err, messages) {
            da_message.getSenderForMessages(messages, function(messages) {
                
                res.render('inbox', {
                    title: 'Inbox',
                    userid: userid,
                    messages: messages, 
                    unreadCount: unreadCount
                });
                
            });
        });
    });
});

router.get('/message', rdl, function(req, res, next) {
    da_message.getMessageById(req.query.id, function(err, message) {
        da_message.markMessageAsRead(req.query.id, function(err) {
            da_message.getUnreadCount(req.session.userid, function(err, unreadCount) {
                da_message.getSenderForMessage(message, function(err, message){
                    res.render('read_message', {
                        title: message.title,
                        userid: req.session.userid,
                        message: message,
                        unreadCount: unreadCount
                    });
                });
            });
        });
    });
});

module.exports = router;