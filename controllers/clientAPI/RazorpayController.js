const Razorpay = require('razorpay');
const orderid = require('order-id')('key');
// Customer Register API
exports.paymentOrders = (req, res) => {
    let { totalAmount } = req.body.payload
    const order_id = orderid.generate();
    let instance = new Razorpay({
        key_id: 'rzp_test_FFbMVLLcpRLTyr',
        key_secret: 'HUdpXmCCjSNYdFZyyDHkHAFn',
    });
    var options = {
        amount: totalAmount * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: `GBH_ORDER_ID_${order_id}`
    };
    instance.orders.create(options).then((response) => {
        res.status(200).json({ data: response, message: 'order created' })
    }).catch((error) => {
        res.status(400).json(error.message)
    })

}

exports.paymentVerify = (req, res) => {
    console.log(req.body);

    // const order_id = orderid.generate();
    // var instance = new Razorpay({
    //     key_id: 'rzp_test_FFbMVLLcpRLTyr',
    //     key_secret: 'HUdpXmCCjSNYdFZyyDHkHAFn',
    // });
    // var options = {
    //     amount: req.body.payload.totalAmount * 100,  // amount in the smallest currency unit
    //     currency: "INR",
    //     receipt: `GBH_ORDER_ID_${order_id}`
    // };
    // instance.orders.create(options).then((response) => {
    //     res.status(200).json(response)
    // }).catch((error) => {
    //     res.status(400).json(error)
    // })

}