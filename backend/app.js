const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authenticate = require('./api/middleware/authenticate');
const path = require('path')
const bodyParser = require('body-parser');


//Connect to mongoDB
mongoose.connect('mongodb+srv://'+ process.env.MONGODB_USERNAME +':'+ process.env.MONGODB_PASSWORD +'@cluster0.t0x6x.mongodb.net/mendpressdb?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const adminRoutes = require('./api/routes/admins');
const categoryRoutes = require('./api/routes/categories');
const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const cartItemRoutes = require('./api/routes/cartItems');
const orderRoutes = require('./api/routes/orders');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

app.use('/admin', adminRoutes)
app.use('/category', categoryRoutes)
app.use('/user', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', authenticate, cartItemRoutes)
app.use('/order', authenticate, orderRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not Found sorry'
    })
})


module.exports = app;

