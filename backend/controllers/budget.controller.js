const db = require("../models");
const Budget = db.Budget;

// GET งบทั้งหมด
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budgets", error: err.message });
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
