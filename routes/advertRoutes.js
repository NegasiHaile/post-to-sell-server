const router = require("express").Router();
const advertCntrlr = require("../controllers/advertCntrlr");
const Auth = require("../middleware/Auth");

router.post("/add", advertCntrlr.addAdvert);
router.get("/list", advertCntrlr.getAllAdvertd);
router.put("/edit/:id", Auth(["user"]), advertCntrlr.editAdvert);
router.delete(
  "/delete/:id",
  Auth(["admin", "user"]),
  advertCntrlr.deleteAdvert
);

module.exports = router;
