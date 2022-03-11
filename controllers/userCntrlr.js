const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCntrlr = {
  // User registration
  signUp: async (req, res) => {
    try {
      const { fName, lName, email, role, password } = req.body; // accept values from the client.

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "A user with email exist!" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 character lengthen!" });

      // password encryption
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Users({
        fName,
        lName,
        email,
        role,
        password: hashedPassword,
      });

      // Save the user to database
      await newUser.save();

      // Then create a token for authentication then a user can signin authomaticaly
      const accessToken = createAccessToken({ id: newUser.id });
      const refreshToken = createRefreshToken({ id: newUser.id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/edp/users/refresh_token",
      });

      res.json({ token: { accesstoken, refreshtoken } });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // Fetch all users
  usersList: (req, res) => {
    res.json({ msg: "Users list!" });
  },

  // Edit user detail
  editUser: (req, res) => {
    res.json({ msg: "User detail edited!" });
  },

  // Delete user detail
  deleteUser: (req, res) => {
    res.json({ msg: "User deleted!" });
  },

  // Signin
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) res.status(500).json({ msg: "User doesn't exist!" });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        return res.status(400).json({ msg: "Invalid credintials!" });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ token: { accesstoken, refreshtoken } });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // Refresh token
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (userId) => {
  return jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const createRefreshToken = (userId) => {
  return jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
module.exports = userCntrlr;
