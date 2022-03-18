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
router.get("/detail/:id", productCntrlr.getProductDetail);
router.put("/edit/:id", Auth(["user"]), productCntrlr.editProduct);
router.put(
  "/edit/image/:id",
  Auth(["user"]),
  upload.single("image"),
  productCntrlr.editProductImage
);
router.delete(
  "/delete/:id",
  Auth(["admin", "user"]),
  productCntrlr.deleteProduct
);
router.put(
  "/delete/image/:id/:image",
  Auth(["user"]),
  productCntrlr.deleteProductImage
);

module.exports = router;
