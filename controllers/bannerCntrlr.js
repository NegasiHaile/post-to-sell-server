const Banners = require("../models/bannerModel");

const fs = require("fs");
const bannerCntrlr = {
  addBanner: async (req, res) => {
    console.log(req.file);
    try {
      const { title, sequence, duration } = req.body;
      const newBanner = new Banners({
        banner: "uploads/banners/" + req.file.filename,
        title,
        sequence,
        duration,
      });
      await newBanner.save();
      res.json({ msg: "Banner added successfuly!" });
    } catch (error) {
      await removeBanner("uploads/banners/" + req.file.filename);
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
      await Banners.findOneAndUpdate(
        { _id: req.params.id },
        ({ title, sequence, duration } = req.body)
      );
      res.json({ msg: "Banner edited successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editBannerImage: async (req, res) => {
    try {
      if (req.file) {
        const bnr = await Banners.findById({ _id: req.params.id });
        await removeBanner(bnr.banner);
        await Banners.findOneAndUpdate(
          { _id: req.params.id },
          { banner: "uploads/banners/" + req.file.filename }
        );
        res.json({ msg: "Banner updated successfuly!" });
      } else {
        return res.status(400).json({ msg: "Banner file required!" });
      }
    } catch (error) {
      await removeBanner("uploads/banners/" + req.file.filename);
      res.status(500).json({ msg: error.message });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      const bnr = await Banners.findById({ _id: req.params.id });
      await Banners.findByIdAndDelete({ _id: req.params.id });
      await removeBanner(bnr.banner);
      res.json({ msg: "Banner deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};
const removeBanner = async (bannerPath) => {
  await fs.unlink(bannerPath, function (err) {
    return true;
  });
};
module.exports = bannerCntrlr;
