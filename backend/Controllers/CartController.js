const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserSchema");

// crete carT
const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

const addToCart = async (req, res) => {
  try {
    const { pid, name, price, quantity, category, image, size } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch product by ID
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Use master size list to get index for stock
    const sizeIndex = ALL_SIZES.indexOf(size);
    if (sizeIndex === -1) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    const availableStock = product.stock[sizeIndex];
    
    if (!availableStock || availableStock <= 0) {
      return res.status(400).json({ message: `Size ${size} is out of stock` });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, cartItems: [] });
    }

    // Check existing item in cart for this product & size
    const existingItem = cart.cartItems.find(
      (item) => item.product.toString() === pid && item.size === size
    );

    // Calculate total quantity if adding
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    if (newQuantity > availableStock) {
      return res.status(400).json({
        message: `Only ${availableStock} item(s) was available in stock for size ${size}`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.cartItems.push({
        product: pid,
        name,
        price,
        quantity,
        category,
        image,
        size,
      });
    }

    await cart.save();
    res.status(200).json(cart.cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//   get user cart
const getUserCart = async (req, res) => {

  try {
    const cart = await Cart.find({ user: req.user.id });
    if (!cart || cart.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }
   return res.status(200).json(cart[0].cartItems);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//   delete cart

const deleteCartItem = async (req, res) => {
  try {
    // Find the cart by the logged-in user's ID
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // Filter out the item with the matching product ID
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== req.params.pid
    );
    
    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cartItems: cart.cartItems,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    // Delete the entire cart
    await Cart.deleteOne({ user: req.user.id });

    return res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    // Find the cart by the logged-in user's ID
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.cartItems.find(
      (item) => item.product.toString() === req.params.pid
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Decrease the quantity by 1
    item.quantity -= 1;

    // Save the updated cart
    await cart.save();

    return res.status(200).json(cart.cartItems);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getUserCart,
  deleteCartItem,
  deleteCart, 
  decreaseQuantity,
};
