const Banners = require("../models/bannerModel");

const bannerCntrlr = {
  addBanner: async (req, res) => {
    try {
      res.json({ msg: "Banner added successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllBanners: async (req, res) => {
    try {
      res.json(await Banners.find());
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editBanner: async (req, res) => {
    try {
      res.json({ msg: "Banner edited successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      res.json({ msg: "Banner deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = bannerCntrlr;
