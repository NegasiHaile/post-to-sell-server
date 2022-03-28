const router = require("express").Router();
const bannerCntrlr = require("../controllers/bannerCntrlr");
const Auth = require("../middleware/Auth");
const { upload } = require("../middleware/ImageUpload");

router.post(
  "/add",
  Auth(["admin"]),
  upload.single("banner"),
  bannerCntrlr.addBanner
);
router.get("/list", bannerCntrlr.getAllBanners);
router.put("/edit/:id", Auth(["admin"]), bannerCntrlr.editBanner);
router.put(
  "/edit/banner/:id",
  Auth(["admin"]),
  upload.single("banner"),
  bannerCntrlr.editBannerImage
);
router.delete("/delete/:id", Auth(["admin"]), bannerCntrlr.deleteBanner);

module.exports = router;
