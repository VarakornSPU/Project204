const db = require("../models");
const Receipt = db.Receipt; // ✅ แก้ตรงนี้ให้ตรงชื่อ model

exports.createReceipt = async (req, res) => {
  try {
    const { po_id, description, quantity, unit } = req.body;
    const receipt = await Receipt.create({
      po_id,
      description,
      quantity,
      unit
    });
    res.status(201).json(receipt);
  } catch (err) {
    console.error("❌ CREATE RECEIPT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.findAll({
      include: ["purchase_order"],
    });
    res.json(receipts);
  } catch (err) {
    console.error("❌ GET RECEIPTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
