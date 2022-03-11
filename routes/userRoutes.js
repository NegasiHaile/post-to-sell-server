const router = require("express").Router();
const userCntrlr = require("../controllers/userCntrlr");
const Auth = require("../middleware/Auth");
// Signup new user
router.post("/signup", userCntrlr.signUp);

// Get all users list
router.get("/list", userCntrlr.usersList);

// Edit a user detail
router.put("/edit/:id", userCntrlr.editUser);

// Delete a user
router.delete("/delete/:id", userCntrlr.deleteUser);

// Signin router
router.post("/signin", userCntrlr.signIn);

// Get profile
router.get("/profile", Auth, userCntrlr.getProfile);

// Refresh token
router.get("/refresh_token", userCntrlr.refreshToken);

module.exports = router;
