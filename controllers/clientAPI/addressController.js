const Useraddress = require("../../models/addressSchema");

exports.addAddress = (req, res) => {
    const { payload } = req.body;
    if (payload.address) {
        if (payload.address._id) {
            Useraddress.findOneAndUpdate(
                { user: req.user._id, "address._id": payload.address._id },
                {
                    $set: {
                        "address.$": payload.address,
                    },
                }
            ).then((address) => {
                if (address) {
                    res.status(200).json({ address });
                }
            }).catch((errors) => res.status(400).json({ errors }));
        } else {
            Useraddress.findOneAndUpdate(
                { user: req.user._id },
                {
                    $push: {
                        address: payload.address,
                    },
                },
                { new: true, upsert: true }
            ).then((address) => {
                if (address) {
                    res.status(200).json({ address, message: "Save Address Successfully" });
                }
            }).catch((errors) => res.status(400).json({ errors }));
        }
    } else {
        res.status(400).json({ errors: "Technocal issue" });
    }
};



// -----------Get Address--------------------
exports.getAddress = (req, res) => {
    Useraddress.findOne({ user: req.user._id }).then((userAddress) => {
        if (userAddress) {
            res.status(200).json({ userAddress, message: "Get address Successfully...." });
        }
    }).catch((error) => res.status(400).json({ error }));
};