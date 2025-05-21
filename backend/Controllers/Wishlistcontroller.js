const Wishlist = require("../Models/WishlistModel");

// create a new Wishlist
const createWishlist = async (req, res) => {
  try {
    const { product_name, product_price, product_category, product_image } = req.body;
    
    // Check if the user already has this product in their wishlist
    const isAdded = await Wishlist.findOne({ 
      product_name, 
      user: req.user.id  // Check for the specific user
    });

    if (isAdded) {
      return res.status(400).json({ message: "Product already added to wishlist" });
    }

    // Convert price to number if it's a string
    const price = typeof product_price === 'string' ? parseFloat(product_price) : product_price;
    
    // Create new wishlist item
    const wishlist = new Wishlist({
      user: req.user.id,
      product_name,
      product_price: price,
      product_category,
      product_image,
    });
    
    const savedWishlist = await wishlist.save();
    return res.status(200).json({ 
      savedWishlist, 
      message: "Product added to wishlist successfully" 
    });
  } catch (error) {
    console.error("Wishlist error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    get wishlist by user id (get)
const getUserWishlist = async (req, res) => {
  const { id } = req.user;

  try {
    const wishlist = await Wishlist.find({ user: id });

    return res.status(200).json(wishlist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//   delete wishlist
const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById({ _id: req.params.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: "User Not Found !" });
    }

    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User Not Autherized" });
    }
    await wishlist.deleteOne();
    return res.status(200).json({ message: "Wishlist deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWishlist,
  getUserWishlist,
  deleteWishlist,
};
