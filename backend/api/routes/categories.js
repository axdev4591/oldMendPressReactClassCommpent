const express = require('express');
const router = express.Router();
const catCtrl =  require('../controllers/categories')

router.get('/', catCtrl.getCategories)

router.post('/', catCtrl.createCategory)

module.exports = router;