const { reset } = require("nodemon");
const Categories = require("../models/categoryModel");
const categoryCntrlr = {
  // Add new  products category
  addCategory: async (req, res) => {
    try {
      const { category, description } = req.body;
      const newCategory = new Categories({
        category,
        description,
      });

      await newCategory.save();
      res.json({ msg: "Category aded successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Fetch alla categories
  getCategories: async (req, res) => {
    res.json({ msg: await Categories.find() });
  },
  // Edit a category
  editCategory: async (req, res) => {
    try {
      await Categoryies.findOneAndUpdate(
        { _id: req.params.id },
        ({ category, description } = req.body)
      );

      res.json({ msg: "Category edited successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Delete single category
  deleteCategory: async (req, res) => {
    try {
      await Categories.findOneAndDelete({ _id: req.params.id });
      res.json({ msg: "Category deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = categoryCntrlr;
