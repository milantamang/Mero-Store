const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  //  image: String,
  },
  { timestamps: true }
);

const CategorySchema = mongoose.model("Category", categorySchema);
module.exports = CategorySchema;
