var express = require('express');
var router = express.Router();
var da = require('../data_access/da');


router.post('/', function(req, res, next) {
    var namePattern = req.body['search'];
    da.search(namePattern, function(err, persons) {
        res.render('persons', {title: 'Search Result', persons: persons});
    });
});

router.get('/', function(req, res, next) {
    res.render('persons_get', {title: "Persons"});
});

router.get('/add', function(req, res, next) {
    res.render('add_person', {title: 'Add Person'});
});

router.post('/add', function(req, res, next) {
    var first_name = req.body['first_name'];
    var last_name = req.body['last_name'];
    var gender = req.body['gender'];
    var street_address = req.body['street_address'];
    var zip = req.body['zip'];
    var city = req.body['city'];
   
    da.savePerson({
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        address: {
            street_address: street_address,
            zip: zip,
            city: city
        }
    }, function(err) {
        res.render('person_saved', {title: 'Person saved'});
    });
    
});

module.exports = router;