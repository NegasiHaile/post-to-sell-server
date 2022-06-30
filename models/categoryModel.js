const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: "Category name is required!",
      unique: true,
      trim: true,
    },
    subCategory: {
      type: Array,
    },
    postFee: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
