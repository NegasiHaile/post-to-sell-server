const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const checkPerimssion = async (perimssions, user) => {
  const profile = await Users.findById(user.id).select("-password");
  console.log(profile);
  if (profile.accountStatus !== "ON") return false;
  return perimssions.includes(profile.role);
};

const Auth = (perimssions) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(400).json({ msg: "Invalid Authorization" });

      // Check token validity and expiration
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err)
          return res
            .status(400)
            .json({ msg: "Expired or Invalid Authorization" });

        const authorized = await checkPerimssion(perimssions, user);
        // Check if the user is authorized
        if (!authorized)
          return res.status(400).json({ msg: "Unauthorized access!" });

        req.user = user;
        next();
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
};

module.exports = Auth;
