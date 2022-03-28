const Adverts = require("../models/advertModel");

const fs = require("fs");

const advertCntrlr = {
  addAdvert: async (req, res) => {
    try {
      const { title, description, type, link, duration } = req.body;

      const newAdvert = new Adverts({
        userId: req.user.id,
        title,
        description,
        type,
        advertBanner: "uploads/adverts/" + req.file.filename,
        link,
        duration,
      });
      await newAdvert.save();
      res.json({ msg: "Advert added successfuly!" });
    } catch (error) {
      await removeAdvetBanner("uploads/adverts/" + req.file.filename);
      res.status(500).json({ msg: error.message });
    }
  },
  getAllAdvert: async (req, res) => {
    try {
      res.json(await Adverts.find());
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editAdvert: async (req, res) => {
    try {
      const validUser = await validatAdvertOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });

      await Adverts.findOneAndUpdate(
        { _id: req.params.id },
        ({ title, description, type, link, duration } = req.body)
      );
      res.json({ msg: "Advert eited successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editAdvertBanner: async (req, res) => {
    try {
      if (req.file) {
        const validUser = await validatAdvertOwner(req.user.id, req.params.id);

        if (!validUser)
          return res.status(400).json({ msg: "Perimission denied!" });

        const advert = await Adverts.findById({ _id: req.params.id });
        await removeAdvetBanner(advert.advertBanner);
        await Adverts.findOneAndUpdate(
          { _id: req.params.id },
          { advertBanner: "uploads/adverts/" + req.file.filename }
        );
        res.json({ msg: "Banner updated successfuly!" });
      } else {
        return res.status(400).json({ msg: "Banner required!" });
      }
    } catch (error) {
      await removeAdvetBanner("uploads/adverts/" + req.file.filename);
      res.status(500).json({ msg: error.message });
    }
  },
  deleteAdvert: async (req, res) => {
    try {
      const validUser = await validatAdvertOwner(req.user.id, req.params.id);

      if (!validUser)
        return res.status(400).json({ msg: "Perimission denied!" });

      const advert = await Adverts.findById({ _id: req.params.id });
      await removeAdvetBanner(advert.advertBanner);
      await Adverts.findOneAndDelete({ _id: req.params.id });
      res.json({ msg: "Advert deleted successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};
const validatAdvertOwner = async (userId, advertId) => {
  const product = await Adverts.findById(advertId);
  if (product) {
    if (product.userId === userId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const removeAdvetBanner = async (advertBannerPath) => {
  await fs.unlink(advertBannerPath, function (error) {
    return true;
  });
};

module.exports = advertCntrlr;
