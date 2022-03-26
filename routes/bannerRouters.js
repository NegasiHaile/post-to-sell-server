const router = require("express").Router();
const bannerCntrlr = require("../controllers/bannerCntrlr");
const Auth = require("../middleware/Auth");

router.post("/add", Auth(["admin"]), bannerCntrlr.addBanner);
router.get("/list", bannerCntrlr.getAllBanners);
router.put("/edit/:id", Auth(["admin"]), bannerCntrlr.editBanner);
router.delete("/delete/:id", Auth(["admin"]), bannerCntrlr.deleteBanner);

module.exports = router;
