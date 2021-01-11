const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const productCtrl = require('../controllers/products')
const multer = require('../middleware/multer-config')


router.post('/create', authenticate, multer, productCtrl.createProduct);

router.get('/', productCtrl.getAllProducts);

router.get('/:categorySlug', productCtrl.getCategorySlug);

router.get('/:categorySlug/:productSlug', productCtrl.getProduct);

router.put('/update/:id', authenticate, multer, productCtrl.updateProduct)

router.delete('/delete/:id', authenticate, multer, productCtrl.deleteProduct)


module.exports = router;