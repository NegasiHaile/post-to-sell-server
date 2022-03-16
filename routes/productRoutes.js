const router = require("express").Router();
const res = require("express/lib/response");
const productCntrlr = require("../controllers/productCntrlr");
const Auth = require("../middleware/Auth");

router.post("/add", productCntrlr.addProduct);
router.get("/list/all", productCntrlr.getAllProducts);
router.put("/edit/:id", productCntrlr.editProduct);
router.delete("/delete/:id", productCntrlr.deleteProduct);

module.exports = router;
