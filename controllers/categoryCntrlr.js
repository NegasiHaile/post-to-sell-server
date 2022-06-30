const Categories = require("../models/categoryModel");
const fs = require("fs");

const categoryCntrlr = {
  // Add new  products category
  addCategory: async (req, res) => {
    try {
      const { category, subCategory, description, postFee } = req.body;
      const existingCategory = await Categories.findOne({ category: category });
      if (existingCategory) {
        return res.status(400).json({ msg: "Category exist!" });
      } else {
        const newCategory = new Categories({
          category,
          subCategory,
          description,
          postFee,
          categoryImage: "uploads/products/categories/",
        });
        await newCategory.save();
        res.json({ msg: "Category added successfuly!", detail: newCategory });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Fetch all categories
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
        ({ category, subCategory, description } = req.body)
      );

      res.json({ msg: "Category edited successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Change a category Image
  editCategoryImage: async (req, res) => {
    try {
      if (req.file) {
        const category = await Categories.findById({ _id: req.params.id });
        await removeCategoryImage(category.categoryImage);
        await Categories.findOneAndUpdate(
          { _id: req.params.id },
          { categoryImage: "uploads/products/categories/" + req.file.filename }
        );
        res.json({ msg: "Category image changed successfuly!" });
      } else {
        return res.status(400).json({ msg: "Category image is required!" });
      }
    } catch (error) {
      await removeCategoryImage(
        "uploads/products/categories/" + req.file.filename
      );
      res.status(500).json({ msg: error.message });
    }
  },
  // Delete single category
  deleteCategory: async (req, res) => {
    try {
      const category = await Categories.findById({ _id: req.params.id });
      await Categories.findOneAndDelete({ _id: req.params.id });
      await removeCategoryImage(category.categoryImage);
      res.json({ msg: "Category deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};
// Remove image from the uploads/products/cetegories
const removeCategoryImage = async (imagePath) => {
  await fs.unlink(imagePath, function (err) {
    return true;
  });
};
module.exports = categoryCntrlr;
