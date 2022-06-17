const router = require("express").Router();
const userCntrlr = require("../controllers/userCntrlr");
const Auth = require("../middleware/Auth");

// Signup new user
router.post("/signup", userCntrlr.signUp);

// Add Admis or Internal users
router.post("/add_internal_user", Auth(["admin"]), userCntrlr.addInternaluser);

// Get all users list
router.get("/list", Auth(["admin"]), userCntrlr.usersList);
router.get(
  "/internal_users_list",
  Auth(["admin"]),
  userCntrlr.InternalUsersList
);

// Edit a user detail
router.put("/edit/:id", Auth(["user"]), userCntrlr.editUser);
router.put("/edit/amins/:id", Auth(["admin"]), userCntrlr.editAdmins);

// Delete a user
router.delete("/delete/:id", Auth(["admin"]), userCntrlr.deleteUser);

// Signin
router.post("/signin", userCntrlr.signIn);

// Get profile
router.get("/profile", Auth(["admin", "user"]), userCntrlr.getProfile);

// Change password
router.put("/change_my_password", Auth(["user"]), userCntrlr.changeMypassword);

// Blocloking and Activeting uses account
router.put(
  "/activate_account/:id",
  Auth(["admin"]),
  userCntrlr.activateUserAccount
);
router.put("/block_account/:id", Auth(["admin"]), userCntrlr.blockUserAccount);

// Refresh token
router.get("/refresh_token", userCntrlr.refreshToken);

module.exports = router;
