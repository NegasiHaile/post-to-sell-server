const Products = require("../models/productModel");

const fs = require("fs");

const productCntrlr = {
  addProduct: async (req, res) => {
    try {
      const files = req.files;
      if (files.length > 0 && files.length <= 5) {
        const {
          productName,
          brand,
          category,
          subCategory,
          price,
          currentPrice,
          discription,
          postType,
          tag,
          contacts,
        } = req.body;

        let imagesPath = [];
        files.forEach((file) => {
          imagesPath.push("uploads/products/" + file.filename);
        });

        const newProduct = new Products({
          userId: req.user.id,
          productName,
          brand,
          category,
          subCategory,
          price,
          currentPrice,
          discription,
          postType,
          tag,
          images: imagesPath,
          contacts,
        });

        await newProduct.save();

        res.json({ msg: "Product added successfuly!" });
      } else {
        res.status(400).json({
          msg: "Images must not less than 1 and not more than 5 items!",
        });
      }
    } catch (error) {
      req.files.forEach((file) => {
        removeImage("uploads/products/" + file.filename);
      });
      res.status(500).json({ msg: error.message });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      res.json(await Products.find());
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllFeaturedProducts: async (req, res) => {
    try {
      res.json(
        await Products.find({
          postType: { $regex: new RegExp("featured", "i") },
        })
      );
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllUserProducts: async (req, res) => {
    try {
      res.json(await Products.find({ userId: req.params.id }));
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getProductDetail: async (req, res) => {
    try {
      res.json(await Products.findById(req.params.id));
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editProduct: async (req, res) => {
    try {
      const validUser = await validatProductOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });

      const updatedData = await Products.findOneAndUpdate(
        { _id: req.params.id },
        ({
          productName,
          brand,
          category,
          subCategory,
          price,
          currentPrice,
          discription,
          postType,
          tag,
          contacts,
        } = req.body),
        { new: true }
      );
      res.json({ data: updatedData, msg: "Product edited successfully!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editProductImage: async (req, res) => {
    try {
      const validUser = await validatProductOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });

      const product = await Products.findById(req.params.id);

      if (product.images.length < 5) {
        const newData = await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: {
              images: "uploads/products/" + req.file.filename,
            },
          },
          { new: true }
        );
        res.json({ data: newData, msg: "Image uploaded successfully" });
      } else {
        await removeImage("uploads/products/" + req.file.filename);
        return res.status(400).json({
          msg: "Only 5 images are allowed to upload, Please remove some images first!",
        });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const validUser = await validatProductOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });

      const product = await Products.findById(req.params.id);

      for (let i = 0; i < product.images.length; i++) {
        await removeImage(product.images[i]);
      }
      await Products.findOneAndDelete({ _id: req.params.id });
      res.json({ msg: "Product deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteProductImage: async (req, res) => {
    try {
      const validUser = await validatProductOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });
      const product = await Products.findById(req.params.id);
      if (!product.images.includes(req.query.imagePath))
        return res.status(400).json({ msg: "Image not found!" });
      if (product.images.length > 1) {
        await removeImage(req.query.imagePath);
        const newData = await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: {
              images: req.query.imagePath,
            },
          },
          { new: true }
        );
        res.json({ data: newData, msg: "Image removed successfuly!" });
      } else {
        return res.status(400).json({
          msg: "Product must have at least one image, Please add more images to remove this one!",
        });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

const validatProductOwner = async (userId, productId) => {
  const product = await Products.findById(productId);
  if (product) {
    if (product.userId === userId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const removeImage = async (imagesPath) => {
  await fs.unlink(imagesPath, function (err) {
    return true;
  });
};

module.exports = productCntrlr;
