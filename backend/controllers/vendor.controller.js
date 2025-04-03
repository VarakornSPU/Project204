const db = require('../models');

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await db.Vendor.findAll();
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'โหลด vendor ไม่ได้', error: err });
  }
};
