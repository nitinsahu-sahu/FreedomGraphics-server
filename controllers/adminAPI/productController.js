const generateslug = require('slugify');
const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');

exports.createProudct = (req, res) => {
    const {
        name, price, offer, description,
        short_description, category, stock, product_type, selling_price
    } = req.body;
    if (!name || !description || !short_description || !stock || !selling_price) {
        return res.status(400).send({ error: "Enter required fields" });
    }
    let productImg = [];
    let featuredImg;
    if (req.files) {
        productImg = req.files.productImg.map(file => {
            return { img: file.filename }
        });
        featuredImg = req.files.featuredImg.map(file => {
            return file.filename
        });
    }
    const product = new Product({
        name: req.body.name, slug: generateslug(name), price, stock,
        product_type, short_description, featuredImg: featuredImg[0], offer, selling_price,
        productImg, description, category, createdBy: req.user._id,
    });
    product.save().then(() => {
        res.status(200).send({ message: "Product created successfully...", product });
    }).catch((errors) => res.status(400).send(errors.message));
}

// ----------------Get Product controller Admin/User Side-------------
function createCategories(findAllCat, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = findAllCat.filter(cat => cat.parentId == undefined);
    } else {
        category = findAllCat.filter(cat => cat.parentId == parentId);
    }
    for (let data of category) {
        categoryList.push({
            _id: data._id,
            name: data.name,
            slug: data.slug,
            parentId: data.parentId,
            type: data.type,
            children: createCategories(findAllCat, data._id),
        });
    }
    return categoryList;
}
exports.getProduct = async (req, res) => {
    const findAllCat = await Category.find({});
    const findAllProduct = await Product.find({}).select(
        '_id  name category selling_price slug price is_delete sellling_price stock description featuredImg short_description productImg status'
    );
    if (findAllProduct && findAllProduct) {
        res.status(200).send({
            message: " Get all Product successfully...",
            findAllCat: createCategories(findAllCat),
            findAllProduct
        });
    } else {
        res.status(400).send(error.message);
    }
}

//Update Products Status
exports.updateProductsStatusById = (req, res) => {
    const { _id, current_status } = req.body;
    Product.findOneAndUpdate(
        { _id: _id },
        { status: current_status },
        { new: true },
    ).then((result) => {
        res.status(200).json({ message: "Update user status Successfully." });
    }).catch((error) => {
        res.status(400).json({ error: "Cannot update user status", error });
    })
};

//Update Products Is_Deleted status
exports.updateProductIsDeleteById = (req, res) => {
    const { _id, current_status } = req.body;
    Product.findOneAndUpdate(
        { _id: _id },
        { is_delete: current_status },
        { new: true }
    ).then((result) => {
        res.status(200).json({ result });
    }).catch((error) => {
        res.status(400).json(error.message);
    })
};