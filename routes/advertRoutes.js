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

// get list of adverts of adverts peruser
router.get(
  "/list/user/:id",
  Auth(["admin", "user"]),
  advertCntrlr.getAllUserAdvert
);

router.put("/edit/:id", Auth(["user"]), advertCntrlr.editAdvert);

// Edit the adver banner(Image)
router.put(
  "/edit/banner/:id",
  Auth(["user"]),
  upload.single("advertBanner"),
  advertCntrlr.editAdvertBanner
);

router.delete("/delete/:id", Auth(["user"]), advertCntrlr.deleteAdvert);

// Approve Advert
router.put("/approve/:id", Auth(["admin"]), advertCntrlr.approveAdvert);

module.exports = router;
