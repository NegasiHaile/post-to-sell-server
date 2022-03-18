const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCntrlr = {
  // User registration
  signUp: async (req, res) => {
    try {
      const { fName, lName, email, phone, contacts, password } = req.body; // accept values from the client.

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
        phone,
        role: "user",
        contacts,
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

      res.json({
        accessToken,
        refreshToken,
        role: "user",
        id: newUser.id,
        accountStatus: "unverified",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // Register Intenal user of the system: - admin
  addInternaluser: async (req, res) => {
    try {
      const { fName, lName, email, contacts, password, role } = req.body; // accept values from the client.

      const user = await Users.findOne({ email });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 character lengthen!" });

      // password encryption
      const hashedPassword = await bcrypt.hash(password, 10);
      if (user)
        return res.status(400).json({ msg: "A user with email exist!" });
      const newUser = new Users({
        fName,
        lName,
        email,
        password: hashedPassword,
        role,
        contacts,
      });

      // Save the user to database
      await newUser.save();

      res.json({ msg: role + " added successfully!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // Fetch all users
  usersList: async (req, res) => {
    try {
      const users = await Users.find({ role: "user" }).select("-password");
      res.json(users);
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Filter all Internal users
  InternalUsersList: async (req, res) => {
    try {
      const internalUsers = await Users.find({
        role: { $ne: "user" },
      }).select("-password");
      res.json(internalUsers);
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Edit user detail
  editUser: async (req, res) => {
    try {
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        ({ fName, lName, email, phone, contacts } = req.body)
      );
      res.json({ msg: "User datail edited successfuly!" });
    } catch (error) {
      res.status(500).json({ meg: error.msg });
    }
  },
  editAdmins: async (req, res) => {
    try {
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        ({ fName, lName, email, phone, role, contacts } = req.body)
      );
      res.json({ msg: "Datail edited successfuly!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // Delete regular user detail
  deleteUser: async (req, res) => {
    try {
      const usr = await Users.findById(req.params.id);
      if (!usr) return res.status(400).json({ msg: "User not found!" });
      if (usr.role !== "user")
        return res
          .status(400)
          .json({ msg: "You are not authorized to delete this user!" });

      await Users.findByIdAndDelete({ _id: req.params.id });
      res.json({ msg: "User has been deleted permanently!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // Signin
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      let user = await Users.findOne({ email });
      if (!user) res.status(500).json({ msg: "User doesn't exist!" });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        return res.status(400).json({ msg: "Invalid credintials!" });
      if (user.accountStatus !== "ON") {
        return res.status(400).json({
          msg: "This account is not active, Please contact the admin!",
        });
      }

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      user.password = null;
      res.json({
        accesstoken,
        refreshtoken,
        profile: user,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // get user profile
  getProfile: async (req, res) => {
    try {
      const profile = await Users.findById(req.user.id).select("-password");
      res.json({ profile });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // Blocking user account
  blockUserAccount: async (req, res) => {
    try {
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          accountStatus: "OFF",
        }
      );
      res.json({ msg: "Account has been disabled successfuly!" });
    } catch (error) {
      res.status(500).json({ meg: error.message });
    }
  },
  // Acitvate uer account
  activateUserAccount: async (req, res) => {
    try {
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          accountStatus: "ON",
        }
      );
      res.json({ msg: "Account has been activated successfuly!" });
    } catch (error) {
      res.status(500).json({ meg: error.message });
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
