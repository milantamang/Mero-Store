const Wishlist = require("../Models/WishlistModel");

// create a new Wishlist
const createWishlist = async (req, res) => {
  console.log("Received wishlist request body:", req.body);
  console.log("Authenticated user:", req.user);

  const { product_name, product_price, product_category, product_image } =
    req.body;

  // Log data types
  console.log("Data types:", {
    product_name: typeof product_name,
    product_price: typeof product_price,
    product_category: typeof product_category,
    product_image: typeof product_image,
  });

  const isAdded = await Wishlist.findOne({ product_name });

  if (isAdded)
    return res
      .status(400)
      .json({ message: "Product already added to wishlist" });

  const wishlist = new Wishlist({
    user: req.user.id,
    product_name,
    product_price,
    product_category,
    product_image,
  });
  try {
    const savedWishlist = await wishlist.save();
    res
      .status(200)
      .json({ savedWishlist, message: "product added wishlist successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
