const generateslug = require('slugify');
const Category = require("../../models/categorySchema");



// Create categories controllers
exports.createCategory = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Category name is required" });
  } else if (!req.body.slug) {
    return res.status(400).json({ error: "Category slug is required" });
  } else {
    const categoryObj = {
      name: req.body.name,
      slug: generateslug(req.body.name),
    }
    if (req.file) {
      categoryObj.featuredImg = process.env.BASE_URL + '/public/' + req.file.filename;
    }
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }
    const category = new Category(categoryObj);
    category.save().then(() => {
      res.status(200).send({ message: "Category created successfully...", category });
    }).catch((error) => res.status(400).send(error.message));
  }

}

// ----------------Get all category-------------
function createCategories(response, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = response.filter(cat => cat.parentId == undefined);
  } else {
    category = response.filter(cat => cat.parentId == parentId);
  }
  for (let data of category) {
    categoryList.push({
      _id: data._id,
      name: data.name,
      slug: data.slug,
      parentId: data.parentId,
      children: createCategories(response, data._id),
    });
  }
  return categoryList;
}


exports.getCategory = async (req, res) => {
  await Category.find({}).then(function (response) {
    const categoryList = createCategories(response)
    res.status(200).send({ message: " Get all category successfully...", categoryList });
  }).catch(function (error) {
    res.status(400).send({ message: "Category name must be unique." }, error);
  })
}

// ----------------Delete category controller Admin Side-------------
exports.deleteCategories = async (req, res) => {
  const ids = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
    deletedCategories.push(deleteCategory);
  }
  if (deletedCategories.length === ids.length) {
    res.status(200).json({ message: 'Category removed Successfully' })
  } else {
    res.status(400).json({ error: 'Something went wrong' })
  }
}


// ----------------Update category controller Admin Side-------------
exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  try {
    const updatedCategories = [];
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        const category = {
          name: name[i],
          type: type[i]
        };
        if (parentId[i] !== "") {
          category.parentId = parentId[i];
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id: _id[i] }, category, { new: true });
        updatedCategories.push(updatedCategory);
      }
      return res.status(201).json({ updateCategories: updatedCategories, message:"Update Category successfully." });
    } else {
      const category = {
        name,
        type
      };
      if (parentId !== "") {
        category.parentId = parentId;
      }
      const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
        new: true,
      });
      return res.status(201).json({ updatedCategory });
    }
  } catch (error) {
    res.status(400).json(error.message)
  }

};
