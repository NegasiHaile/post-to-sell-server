const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
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
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
    },
    currentPrice: {
      type: Number,
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
    images: {
      type: Array,
      required: true,
    },
    contacts: {
      type: Object,
      required: true,
    },
    postPayment: {
      type: Number,
      required: true,
      default: 0,
    },
    postExpireDate: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      required: true,
      default: "new", // values: new, active or archived
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
