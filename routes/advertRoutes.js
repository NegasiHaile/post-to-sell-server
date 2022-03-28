const router = require("express").Router();
const advertCntrlr = require("../controllers/advertCntrlr");
const { upload } = require("../middleware/ImageUpload");
const Auth = require("../middleware/Auth");

router.post(
  "/add",
  Auth(["user"]),
  upload.single("advertBanner"),
  advertCntrlr.addAdvert
);
router.get("/list", advertCntrlr.getAllAdvert);
router.put("/edit/:id", Auth(["user"]), advertCntrlr.editAdvert);
router.put(
  "/edit/banner/:id",
  Auth(["user"]),
  upload.single("advertBanner"),
  advertCntrlr.editAdvertBanner
);
router.delete("/delete/:id", Auth(["user"]), advertCntrlr.deleteAdvert);
// Note: we will add another router for admin to delete an advert

module.exports = router;
