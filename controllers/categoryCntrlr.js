const { reset } = require("nodemon");
const Categories = require("../models/categoryModel");
const categoryCntrlr = {
  // Add new  products category
  addCategory: async (req, res) => {
    try {
      const { category, description } = req.body;
      const existingCategory = await Categories.findOne({ category: category });
      if (category === null)
        return res.status(400).json({ msg: "Category name is required" });

      if (existingCategory)
        return res.status(400).json({ msg: "Category exist!" });
      const newCategory = new Categories({
        category,
        description,
      });
      await newCategory.save();
      res.json({ msg: "Category added successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Fetch alla categories
  getCategories: async (req, res) => {
    res.json(await Categories.find());
  },
  // Edit a category
  editCategory: async (req, res) => {
    try {
      const existingCategory = await Categories.findById({
        _id: req.params.id,
      });
      if (!existingCategory)
        return res.status(400).json({ msg: "Category not found!" });
      await Categories.findOneAndUpdate(
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
