const mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: "Email address is required!",
      validate: [validateEmail, "Please fill a valid email address!"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address!",
      ],
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    contacts: {
      type: Array,
      required: true,
    },
    accountStatus: {
      type: String, // Values: unverified, ON, blocked
      required: true,
      trim: true,
      default: "ON", // When email verified
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
