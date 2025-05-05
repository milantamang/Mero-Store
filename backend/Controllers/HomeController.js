const Offer = require("../Models/HomeModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserSchema");
const Order = require("../Models/orderModel");
const mongoose = require("mongoose");
// add category
const addOffer = async (req, res) => {
  try {
    const { name, image ,offer} = req.body;

    const isExists = await Offer.findOne({ name, image,offer });

    if (isExists)
      return res.status(400).json({ message: "Offer already exists" });

    const newOffer = await Offer.create({ name, image ,offer});

    if (newOffer) {
      return res
        .status(201)
        .json({ newOffer, message: "Offer added successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//   get all categories
const getOffer = async (req, res) => {
  try {
    const homeOffer = await Offer.find({ status: true });

    if (homeOffer) {
      return res.status(200).json({ homeOffer });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllOffers = async (req, res) => {
  try {
    const homeOffer = await Offer.find();

    if (homeOffer) {
      return res.status(200).json({ homeOffer });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (updatedOffer) {
      return res.status(200).json({ message: "Offer status updated successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
//   delete category
const deleteOffer = async (req, res) => {
  const category = await Offer.findById(req.params.id);

  if (!category) {
    return res.status(400).json("main Offer Not Found");
  }

  await Offer.deleteOne();

  res.status(200).json({ message: "main Offer deleted successfully" });
};

const getTotals = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.status(200).json({
      totalProducts,
      totalUsers,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOffer,
  getOffer,
  getAllOffers,
  deleteOffer,
  getTotals,
  updateOfferStatus,
};



