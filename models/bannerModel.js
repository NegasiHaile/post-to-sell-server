const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    sequence: {
      type: Number,
      unique: true,
    },
    duration: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banners", bannerSchema);
