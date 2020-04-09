var express = require('express');
var router = express.Router();
var da_message = require('../data_access/da_message');


router.get('/', function(req, res, next) {
  var userid = req.session['userid'];
  da_message.getUnreadCount(userid, function(err, unreadCount) {
    res.render('index', { title: 'Social Network', userid: userid, unreadCount: unreadCount });
  });
});

module.exports = router;
