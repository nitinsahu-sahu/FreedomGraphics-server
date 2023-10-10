const Order = require("../../models/orderSchema")
const Cart = require('../../models/cartSchema');
const Address = require('../../models/addressSchema')

exports.addOrder = (req, res) => {
    Cart.deleteOne({ user: req.user._id }).then((result) => {
        if (result) {
            req.body.user = req.user._id;
            req.body.orderStatus = [
                {
                    type: "ordered",
                    date: new Date(),
                    isCompleted: true,
                },
                {
                    type: "packed",
                    isCompleted: false,
                },
                {
                    type: "shipped",
                    isCompleted: false,
                },
                {
                    type: "delivered",
                    isCompleted: false,
                },
            ];
            const order = new Order(req.body);
            order.save().then((order) => {
                res.status(200).json({ order, message: "Order successfully." })
            }).catch((error) => {
                res.status(400).json(error.message)
            })
        }
    }).catch((error) => {
        res.status(400).json(error.message)
    })
};


exports.getOrders = (req, res) => {
    Order.find({ user: req.user._id }).select("_id paymentStatus items")
        .populate("items.productId", "_id name featuredImg selling_price")
        .then((orders) => {
            res.status(200).json({ orders, message: "Find order successfully." })
        }).catch((error) => {
            res.status(400).json({ error: "Order empty." })
        })
}

exports.getOrder = (req, res) => {
    Order.findOne({ _id: req.body.orderId }).populate("items.productId", "_id name featuredImg selling_price")
        .lean()
        .then((order) => {
            Address.findOne({ user: req.user._id }).then((address) => {
                order.address = address.address.find(
                    (adr) => adr._id.toString() === order.addressId.toString()
                );
                res.status(200).json({ order, message: "Get user order Successfully.." });
            }
            ).catch((error) =>
                res.status(400).json({ error: error.message })
            );
        }).catch((error) =>
            res.status(400).json({ error: "Cart is empty.." })
        );
};