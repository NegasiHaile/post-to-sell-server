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
          sizes,
          colors,
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
          sizes,
          colors,
          postType,
          tag,
          images: imagesPath,
          contacts,
        });

        await newProduct.save();

        res.json({ msg: "Product added successfuly!", product: newProduct });
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
      const date = new Date();
      res.json(
        await Products.find({
          $and: [
            { postType: { $regex: new RegExp("featured", "i") } },
            { status: { $regex: new RegExp("active", "i") } },
            { postPayment: 1 },
            { postExpireDate: { $gte: date } },
          ],
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
          sizes,
          colors,
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

      // req.body.url is the url of old image
      removeImage(req.body.url);
      // req.params.id is Id of the product
      removeImageURL(req.params.id, req.body.url);
      await addImageURL(
        req.params.id,
        "uploads/products/" + req.file.filename,
        req.body.position
      );
      const newData = await Products.findById(req.params.id);
      res.json({ data: newData, msg: "Image updated successfully" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  addProductImage: async (req, res) => {
    try {
      const validUser = await validatProductOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });

      const product = await Products.findById(req.params.id);
      if (product.images.length < 5) {
        const newData = await addImageURL(
          req.params.id,
          "uploads/products/" + req.file.filename,
          5
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

  deleteProduct: (permissions) => {
    return async (req, res) => {
      try {
        const validUser = await validatProductOwner(
          req.user.id,
          req.params.id,
          permissions
        );

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
    };
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
        const newData = await removeImageURL(
          req.params.id,
          req.query.imagePath
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

  // Update product paymet status
  updateProductPaymentStatus: async (req, res) => {
    try {
      var expireDate = new Date();
      if (req.body.payFor) {
        expireDate.setMonth(expireDate.getMonth() + req.body.payFor);
        const updatedData = await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            postPayment: 1,
            status: "active",
            postExpireDate: expireDate,
          },
          { new: true }
        );
        res.json({ data: updatedData, msg: "Payment done!" });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Approve product:- Means the product content is formal, And it can be seen in the public products list
  approveProduct: async (req, res) => {
    try {
      const updatedData = await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: "active",
        },
        { new: true }
      );
      res.json({ data: updatedData, msg: "Product approved successfully!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  // Archive product:- Means the product will not be display in the public page any more, But exitst in the database
  archiveProduct: async (req, res) => {
    try {
      const updatedData = await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: "archived",
        },
        { new: true }
      );
      res.json({ data: updatedData, msg: "Product archived successfully!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

// This function checks who is allowed to delte the product (the owner and the admin)
const validatProductOwner = async (userId, productId, permissions) => {
  const product = await Products.findById(productId);
  if (product) {
    if (product.userId === userId || permissions?.includes("admin")) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

addImageURL = async (prdct_id, imageUrl, position) => {
  // This function add the new image URL to the images array of spesfic product
  const newData = await Products.findOneAndUpdate(
    { _id: prdct_id },
    {
      $push: {
        images: { $each: [imageUrl], $position: position },
      },
    },
    { new: true }
  );
  return newData;
};

removeImageURL = async (prdct_id, URL) => {
  // This function removes the image URL form the images array
  const newData = await Products.findOneAndUpdate(
    { _id: prdct_id },
    {
      $pull: {
        images: URL,
      },
    },
    { new: true }
  );

  return newData;
};

const removeImage = async (imagesPath) => {
  // This function removes the image from the folder where it is stored
  await fs.unlink(imagesPath, function (err) {
    return true;
  });
};

module.exports = productCntrlr;
