const Order = require("../../models/orderSchema")

exports.updateOrder = (req, res) => {
    Order.updateOne(
        { _id: req.body.orderId, "orderStatus.type": req.body.type },
        {
            $set: {
                "orderStatus.$": [
                    {
                        type: req.body.type,
                        date: new Date(),
                        isCompleted: true
                    },
                ],
            },
        }
    ).then((response) => {
        res.status(200).json({ response })
    }).catch((errors) => {
        res.status(400).json(errors.message)
    })
};

exports.getCustomerOrders = async (req, res) => {
    await Order.find({})
        .populate("items.productId", "_id name featuredImg")
        .then(
            (orders) => {
                res.status(200).json({ orders, message:"Fetch orders successfully." })
            }
        ).catch(
            (errors) => {
                res.status(400).json(errors.message)
            }
        )

};