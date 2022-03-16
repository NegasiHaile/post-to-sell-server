const Products = require("../models/productModel");

const productCntrlr = {
  addProduct: async (req, res) => {
    try {
      res.json({ msg: "Product adde successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      res.json({ msg: "All products!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editProduct: async (req, res) => {
    try {
      res.json({ msg: "Product edited successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      res.json({ msg: "Product deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productCntrlr;
