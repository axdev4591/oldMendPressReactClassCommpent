const express = require('express');
const router = express.Router();
const adminCtrl =  require('../controllers/admins')

router.post('/signup', adminCtrl.signup);

router.post('/login', adminCtrl.login);

/*
router.get('/', (req, res, next) => {

    Admin.find({})
    .exec()
    .then(doc => {
        res.status(201).json({
            message: doc
        });
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    });

});*/

module.exports = router;