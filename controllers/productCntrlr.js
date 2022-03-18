const Products = require("../models/productModel");

const fs = require("fs");

const productCntrlr = {
  addProduct: async (req, res) => {
    try {
      const files = req.files;
      if (files.length > 0 && files.length <= 5) {
        const {
          userId,
          productName,
          category,
          subCategory,
          price,
          discription,
          postType,
        } = req.body;

        let imagesPath = [];
        files.forEach((file) => {
          imagesPath.push(file.filename);
        });

        const newProduct = new Products({
          userId,
          productName,
          category,
          subCategory,
          price,
          discription,
          postType,
          images: imagesPath,
        });

        await newProduct.save();

        res.json({ msg: "Product added successfuly!" });
      } else {
        res.status(400).json({
          msg: "Upload images not less than 1 and not more than 5 items!",
        });
      }
    } catch (error) {
      req.files.forEach((file) => {
        removeImage(file.filename);
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

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        ({ productName, category, subCategory, price, discription, postType } =
          req.body)
      );
      res.json({ msg: "Product edited successfully!" });
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
        await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: {
              images: req.file.filename,
            },
          }
        );
        res.json({ msg: "Image uploaded successfully" });
      } else {
        await removeImage(req.file.filename);
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
      console.log(product);
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
      if (!product.images.includes(req.params.image))
        return res.status(400).json({ msg: "Image not found!" });

      if (product.images.length > 1) {
        fs.unlink("uploads/" + req.params.image, async (err) => {
          await Products.findOneAndUpdate(
            { _id: req.params.id },
            {
              $pull: {
                images: req.params.image,
              },
            }
          );
          res.json({ msg: "Image removed successfuly!" });
        });
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
  await fs.unlink("uploads/" + imagesPath, function (err) {
    return true;
  });
};

module.exports = productCntrlr;
