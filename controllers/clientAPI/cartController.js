const Cart = require("../../models/cartSchema");

function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
        Cart.findOneAndUpdate(condition, updateData, { upsert: true }).then(
            result => resolve()
        ).catch(error => reject(error))
    })
}

exports.addItemToCart = (req, res) => {
    Cart.findOne({ user: req.user._id }).then(cart => {
        if (cart) {
            //if cart already exist then update cart by quantity
            let promiseArray = [];
            req.body.payload.cartItems.forEach((cartItem) => {
                const product = cartItem.product;
                const item = cart.cartItems.find(c => c.product == product);
                let condition, update;
                if (item) {
                    condition = { "user": req.user._id, "cartItems.product": product };
                    update = {
                        "$set": {
                            "cartItems.$": cartItem,
                        }
                    };
                } else {
                    condition = { user: req.user._id };
                    update = {
                        "$push": {
                            "cartItems": cartItem
                        }
                    };
                }
                promiseArray.push(runUpdate(condition, update))
            });
            Promise.all(promiseArray).then(
                response => res.status(200).json({ response })
            ).catch(
                error => res.status(400).json({ error })
            )
        } else {
            //if cart not exist then create a new cart
            const cart = new Cart({
                user: req.user._id,
                cartItems: req.body.payload.cartItems,
            });
            cart.save().then(() => {
                res.status(200).send({ message: "Cart created successfully...", cart });
            }).catch((error) => res.status(400).send({ error: "Invalid data..." }));
        }
    }).catch((error) => res.status(400).json({ error: "empty", error }));
}


//-----------------------------------------------
exports.getCartItems = (req, res) => {
    // const { user } = req.body.payload;
    // if(user){
    Cart.findOne({ user: req.user._id })
        .populate('cartItems.product', '_id name selling_price featuredImg')
        .then((cart) => {
            if (cart) {
                let cartItems = {};
                cart.cartItems.forEach((item, index) => {
                    cartItems[item.product._id.toString()] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        img: item.product.featuredImg,
                        selling_price: item.product.selling_price,
                        qty: item.quantity,
                    };
                });
                res.status(200).json({ cartItems });
            }
        }).catch((error) => res.status(400).json({ error }));
}
// };




// new update remove cart items
exports.removeCartItems = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        Cart.Update(
            { user: req.user._id },
            {
                $pull: {
                    cartItems: {
                        product: productId,
                    },
                },
            }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            }
        });
    }
};