const router = require("express").Router();
const categoryCntrlr = require("../controllers/categoryCntrlr");
const { upload } = require("../middleware/ImageUpload");
const Auth = require("../middleware/Auth");

router.post(
  "/add",
  Auth(["admin"]),
  upload.single("categoryImage"),
  categoryCntrlr.addCategory
);

router.get("/list", categoryCntrlr.getCategories);

router.put("/edit/:id", Auth(["admin"]), categoryCntrlr.editCategory);
router.put(
  "/edit/image/:id",
  Auth(["admin"]),
  upload.single("categoryImage"),
  categoryCntrlr.editCategoryImage
);
router.delete("/delete/:id", Auth(["admin"]), categoryCntrlr.deleteCategory);
module.exports = router;
