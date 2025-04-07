const db = require("../models");
const Budget = db.Budget;
const Payment = db.Payment; // ✅ เพิ่มให้ถูกต้อง
const { Op } = require("sequelize");

// GET งบทั้งหมด
exports.getAllBudgets = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const budget = await Budget.findOne({ where: { year } });

    if (!budget) {
      return res.status(404).json({ message: "ไม่พบงบประมาณของปีนี้" });
    }

    res.json([budget]); // ส่งเป็น array เพื่อให้ frontend ใช้ data[0] ต่อได้
  } catch (err) {
    console.error("Budget GET Error:", err);
    res.status(500).json({ message: "Failed to fetch budget", error: err.message });
  }
};

// POST เพิ่มงบใหม่
exports.createBudget = async (req, res) => {
  const { department, year, initial_amount } = req.body;
  try {
    const newBudget = await Budget.create({
      department,
      year,
      initial_amount,
      used_amount: 0,
    });
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ message: "Failed to create budget", error: err.message });
  }
};

// PUT อัปเดต used_amount
exports.updateUsedAmount = async (department, year, amount) => {
  const budget = await Budget.findOne({ where: { department, year } });
  if (!budget) throw new Error("Budget not found");
  if (budget.used_amount + amount > budget.initial_amount) {
    throw new Error("Budget exceeded");
  }
  budget.used_amount += amount;
  await budget.save();
};

// GET รายงานการใช้งบประมาณจาก payments
exports.getBudgetReport = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: db.PurchaseOrder, as: 'po' },
        { model: db.Vendor, as: 'vendor' }
      ],
      order: [['payment_date', 'DESC']]
    });

    res.json(payments);
  } catch (err) {
    console.error('❌ Budget report error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
