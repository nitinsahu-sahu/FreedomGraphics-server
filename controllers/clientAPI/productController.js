const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');

// ----------------Get Product by Slug controller User Side-------------
exports.getProductBySlug = async (req, res) => {
  Category.findOne({ slug: req.body.params }).then((category) => {
    if (category) {
      Product.find({ category: category._id }).then((products) => {
        if (products.length > 0) {
          res.status(200).json({
            products,
            productsByPrice: {
              under500: products.filter(product => product.selling_price <= 500),
              under5k: products.filter(product => product.price > 501 && product.selling_price <= 5000),
              under10k: products.filter(product => product.price > 5001 && product.selling_price <= 10000),
              under20k: products.filter(product => product.price > 10001 && product.selling_price <= 20000)
            },
            message: "product fatch successfully..."
          });
        }
      }).catch((error) => {
        res.status(400).json({ message: "No Product in database...", error });
      });
    }
  }).catch((error) => {
    res.status(400).json({ message: "No Product in database...", error });
  });
}


// ----------------Get Product By Id controller Admin/User Side-------------
exports.getProductDetailsById = (req, res) => {
    const { productId } = req.body
    if (productId) {
      Product.findOne({ _id: productId }).then((product) => {
        if (product) {
          res.status(200).json({ message: "product found successfully.", product });
        }
      }).catch((error) => {
        res.status(400).json({ message: "No Product in database.", error });
      });
    } else {
      return res.status(400).json({ error: "Params required" });
    }
  };

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

//------------Get All Product-----------
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
