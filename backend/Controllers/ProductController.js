const Product = require("../Models/ProductModel");

// create products
const addProduct = async (req, res) => {
  try {
    const { name, price, category, image, colors, size,stock } = req.body;
    const isExists = await Product.findOne({ name });
    if (isExists)
      return res.status(400).json({ message: "Product already exists" });

    const product = await Product.create({
      name,
      price,
      category,
      image,
      colors,
      size,
      stock,
    });
    return res
      .status(201)
      .json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all Products
const getProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      query = {
        name: { $regex: new RegExp(req.query.search, "i") },
        stock: { $elemMatch: { $gt: 0 } }
      };
    } else {
      query = { stock: { $elemMatch: { $gt: 0 } } };
    }

    const products = await Product.find(query);
    res.status(200).json({ success: true, totalProduct: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// get single products
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if all stock values are 0 or falsy
    const isOutOfStock = product.stock.every((qty) => qty <= 0);

    if (isOutOfStock) {
      return res.status(200).json({ message: "Out of stock" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsAdmin = async (req, res) => {
  try {
    let query = {};
    // Check if there is a 'search' query parameter in the request
    if (req.query.search) {
      // Use a case-insensitive regular expression to match products containing the search keyword
      query = { name: { $regex: new RegExp(req.query.search, "i") } };
    }
    const products = await Product.find(query);
    res
      .status(200)
      .json({ success: true, totalProduct: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single products
const getProductByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route http://localhost:5000/api/products/search?searchQuery=apple
const getProductsBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const name = new RegExp(searchQuery, "i");
    const products = await Product.find({ name });
    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// delete products
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, image, colors, size,stock } = req.body;
    // Find the product by ID
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Update the product fields with the new data
    product.name = name;
    product.price = price;
    product.category = category;
    product.image = image;
    product.colors = colors;
    product.stock = stock
    product.size = size;

    // Save the updated product
    await product.save();
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  getProductsBySearch,
  deleteProduct,
  editProduct,
  getProductById,
  getProductsAdmin,
  getProductByIdAdmin
};
