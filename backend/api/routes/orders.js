const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orders')

router.post('/create', orderCtrl.createOrder)
router.get('/getorders/:userId', orderCtrl.getUserOrders);
router.get('/getorders', orderCtrl.getAllOrders);
router.get('/getusers', orderCtrl.getAllUser);


module.exports = router;