const Category = require("../Models/CategoryModel");

// add category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const isExists = await Category.findOne({ name });

    if (isExists)
      return res.status(400).json({ message: "Category already exists" });

    const newCategory = await Category.create({ name });

    if (newCategory) {
      return res.status(201).json({newCategory, message: "Category added successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//   get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories) {
      return res.status(200).json({ categories });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//   delete category
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(400).json("Category Not Found");
  }

  await category.deleteOne();

  res.status(200).json({ message: "Category deleted successfully" });
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
};
