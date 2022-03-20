const router = require("express").Router();
const categoryCntrlr = require("../controllers/categoryCntrlr");
const Auth = require("../middleware/Auth");

router.post("/add", Auth(["admin"]), categoryCntrlr.addCategory);

router.get("/list", categoryCntrlr.getCategories);

router.put("/edit/:id", Auth(["admin"]), categoryCntrlr.editCategory);

router.delete("/delete/:id", Auth(["admin"]), categoryCntrlr.deleteCategory);
module.exports = router;
