var express = require('express');
var router = express.Router();
var da_users = require('../data_access/da_users');
var bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    res.render('login', {title: "Login"});
});


router.post('/', function(req, res, next) {
    da_users.getUserByUsername(req.body['username'], function(err, user) {
        if(user) {
            bcrypt.compare(req.body['password'], user.password, function(err, answer) {
                if(answer) {
                    req.session.userid = user._id;
                    res.redirect('/');
                }
                else {
                    res.redirect('login', 401);
                }
            })
        }
        else {
            res.redirect('login', 401);
        }
    });
});

module.exports = router;