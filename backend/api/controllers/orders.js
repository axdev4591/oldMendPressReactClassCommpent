const mongoose = require('mongoose');
const Order = require('../models/order');
const CartItem = require('../models/cartItem');
const UserAddress = require('../models/userAddress');
const User =  require('../models/user')


exports.createOrder = (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        order: req.body.order,
        address: req.body.address,
        paymentType: req.body.paymentType,
        paymentStatus: req.body.paymentStatus
    });

    order.save()
    .then(order => {

        CartItem.remove({"user": req.body.user})
        .exec()
        .then(doc => {
            res.status(201).json({
                message: order
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        })


        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    })
}

exports.getUserOrders = (req, res, next) => {

    const userId = req.params.userId;
    Order.find({"user": userId})
    .select('address order orderDate paymentType paymentStatus isOrderCompleted')
    .populate('order.product', 'name imageUrl')
    .exec()
    .then(orders => {

        console.log("get user order"+userId + "  "+orders)
        UserAddress.findOne({"user": userId})
        .exec()
        .then(userAddress => {

            const orderWithAddress = orders.map(order => {
                const address = userAddress.address.find(userAdd => order.address.equals(userAdd._id));
                return {
                    _id: order._id,
                    order: order.order,
                    address: address,
                    orderDate: order.orderDate,
                    paymentType: order.paymentType,
                    paymentStatus: order.paymentStatus,
                    isOrderComleted: order.isOrderComleted
                }
            });

            res.status(200).json({
                message: orderWithAddress
            });
            console.log("order with adress: "+ orderWithAddress)

        })
        .catch(error => {
            return res.status(500).json({
                error: error
            })
        })

        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });

}

exports.getAllUser = (req, res, next) => {

    User.find()
    .then(user => {
        res.status(200).json({
            message: user
        })
        console.log(user)
    })
    .catch(error => {
        console.log("no user found")
        res.status(500).json({
            error: error
        })
      
    })

}

exports.getAllOrders = (req, res, next) => {

    const userId = req.params.userId;
    Order.find()
    .select('address order orderDate paymentType paymentStatus isOrderCompleted')
    .populate('order.product', 'name imageUrl')
    .exec()
    .then(orders => {

        UserAddress.findOne()
        .exec()
        .then(userAddress => {

            const orderWithAddress = orders.map(order => {
                const address = userAddress.address.find(userAdd => order.address.equals(userAdd._id));
                const user = User.findOne({_id: order.user});
                return {
                    _id: order._id,
                    order: order.order,
                    address: address,
                    orderDate: order.orderDate,
                    paymentType: order.paymentType,
                    paymentStatus: order.paymentStatus,
                    isOrderCompleted: order.isOrderCompleted,
                    user: user 
                }
            });

            res.status(200).json({
                message: orderWithAddress
            });
            console.log("order with adress: "+ orderWithAddress)

        })
        .catch(error => {
            return res.status(500).json({
                error: error
            })
        })

        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });

}

exports.deleteOrder = (req, res, next) => {

}

exports.updateOrder = (req, res, next) => {

}