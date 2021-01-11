const express = require('express');
const router = express.Router();
const authenticate  = require('../middleware/authenticate');
const usersCtrl = require('../controllers/users')


router.post('/signup', usersCtrl.signup);

router.post('/login', usersCtrl.login);

router.post('/new-address', authenticate, usersCtrl.createAddress);

router.get('/get-addresses/:userId', authenticate, usersCtrl.getAddress);



module.exports = router;