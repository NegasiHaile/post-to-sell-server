const Adverts = require("../models/advertModel");

const advertCntrlr = {
  addAdvert: async (req, res) => {
    try {
      res.json({ msg: "Advert added successfuly!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllAdvertd: async (req, res) => {
    try {
      res.json(await Adverts.find());
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  editAdvert: async (req, res) => {
    try {
      res.json({ msg: "Advert eited successfuly!" + req.params.id });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteAdvert: async (req, res) => {
    try {
      res.json({ msg: "Advert added successfuly!" + req.params.id });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = advertCntrlr;
