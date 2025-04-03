const Offer = require("../Models/HomeModel");

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
    const homeOffer = await Offer.find();

    if (homeOffer) {
      return res.status(200).json({ homeOffer });
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

module.exports = {
  addOffer,
  getOffer,
  deleteOffer,
};
