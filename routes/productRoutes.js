const router = require("express").Router();
const productCntrlr = require("../controllers/productCntrlr");
const Auth = require("../middleware/Auth");
const { upload } = require("../middleware/ImageUpload");

router.post(
  "/add",
  Auth(["user"]),
  upload.array("images", 5),
  productCntrlr.addProduct
);
router.get("/list/all", productCntrlr.getAllProducts);
router.get("/list/all/featured", productCntrlr.getAllFeaturedProducts);
router.get(
  "/list/all/user/:id",
  Auth(["admin", "user"]),
  productCntrlr.getAllUserProducts
);
router.get("/detail/:id", productCntrlr.getProductDetail);
router.put("/edit/:id", Auth(["user"]), productCntrlr.editProduct);
router.put(
  "/edit/image/:id",
  Auth(["user"]),
  upload.single("image"),
  productCntrlr.editProductImage
);
router.put(
  "/add/image/:id",
  Auth(["user"]),
  upload.single("image"),
  productCntrlr.addProductImage
);
router.delete(
  "/delete/:id",
  Auth(["admin", "user"]),
  productCntrlr.deleteProduct
);
router.put(
  "/delete/image/:id",
  Auth(["user"]),
  productCntrlr.deleteProductImage
);

// Approve product
router.put("/approve/:id", Auth(["admin"]), productCntrlr.approveProduct);

module.exports = router;
