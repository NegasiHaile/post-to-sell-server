const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    discription: {
      type: String,
      trim: true,
    },
    postType: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
    },
    images: {
      type: Array,
      required: true,
    },
    contacts: {
      type: Array,
      required: true,
    },
    reactions: {
      type: Array,
    },
    rate: {
      type: Number,
      required: true,
      default: 0,
    },
    postPayment: {
      type: String,
      required: true,
      default: "1",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
