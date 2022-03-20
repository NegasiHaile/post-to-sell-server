const router = require("express").Router();
const categoryCntrlr = require("../controllers/categoryCntrlr");
const Auth = require("../middleware/Auth");

router.post("/add", categoryCntrlr.addCategory);

router.get("/list", categoryCntrlr.getCategories);

router.put("/edit/:id", categoryCntrlr.editCategory);

router.delete("/delete/:id", categoryCntrlr.deleteCategory);
module.exports = router;
