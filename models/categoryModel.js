const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
      require: true,
    },
    discription: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
