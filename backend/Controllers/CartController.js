const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserSchema");

// crete carT
const createCart = async (req, res) => {
  try {
    const {
      product_name,
      product_price,
      product_quantity,
      product_category,
      product_image,
    } = req.body;

    const user = await User.findById(req.user.id);
    

    const product = await Product.findById(req.body.pid);
    console.log(product);
    

    const isItemInCart = user.cartItems.find(
      (item) => item.product.toString() === product._id.toString()
    );
    console.log(isItemInCart);
 

    if (isItemInCart) {
      return res.status(400).json({ message: "Item is already in cart" });
    }

    user.cartItems.push({
      product: product._id,
    });

    await user.save();

    const newCart = new Cart({
      user: req.user.id,
      product_id: product._id,
      product_name,
      product_price,
      product_quantity,
      product_category,
      product_image,
    });
    console.log("newCart:", newCart);

    await newCart.save();

    res.status(200).json({ message: "Item added to cart" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//   get user cart
const getUserCart = async (req, res) => {
  // const { id } = req.user;

  try {
    const cart = await Cart.find({ user: req.user.id });
    console.log(cart)
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//   delete cart

const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findById({ _id: req.params.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: "User Not Found !" });
    }

    if (cart.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User Not Autherized" });
    }

    const user = await User.findById(req.user.id);

    const product = await Product.findById(req.params.pid);

    const isItemInCart = user.cartItems.find(
      (item) => item.product.toString() === product._id.toString()
    );

    if (isItemInCart) {
      user.cartItems.pop({
        product: product._id,
      });
    }

    await user.save();

    await cart.remove();
    return res.status(200).json({ message: "Cart deleted successfully", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCart,
  getUserCart,
  deleteCart,
};
