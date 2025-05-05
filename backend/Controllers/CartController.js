const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserSchema");

// crete carT
const addToCart = async (req, res) => {
  try {
    const { pid, name, price, quantity, category, image, size } = req.body;
    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the cart exists for the user
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user: req.user.id,
        cartItems: [],
      });
    }

    // Check if the item with the same size already exists in the cart
    const existingItem = cart.cartItems.find(
      (item) => item.product.toString() === pid && item.size === size
    );

    if (existingItem) {
      // Update the quantity if the item already exists
      existingItem.quantity += quantity;
    } else {
      // Add the new item to the cart
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

    // Save the cart
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
