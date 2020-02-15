var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Strona główna', authorized: req.session.login?true:false });
});

module.exports = router;
