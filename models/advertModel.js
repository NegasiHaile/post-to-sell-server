const mongoose = require("mongoose");

const addSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String, // Regular, Featured
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    duration: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adverts", addSchema);
