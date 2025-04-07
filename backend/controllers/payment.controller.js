const db = require('../models');
const Invoice = db.Invoice;
const Payment = db.Payment;
const Budget = db.Budget;
const { Op } = require('sequelize');

// 📌 ดึงใบแจ้งหนี้ที่ยัง pending
exports.getPendingInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { status: 'pending' },
      include: [
        { model: db.Vendor, as: 'vendor' },
        { model: db.PurchaseOrder, as: 'po' }
      ],
      order: [['due_date', 'ASC']]
    });

    res.json(invoices);
  } catch (err) {
    console.error('❌ Error fetching pending invoices:', err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 ชำระเงิน + หักงบ
exports.makePayment = async (req, res) => {
  try {
    const { invoice_id, payment_date, payment_method } = req.body;
    const file = req.file;

    const invoice = await db.Invoice.findByPk(invoice_id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // ✅ หางบประมาณของปี 2025
    const budgetYear = new Date(payment_date).getFullYear();
    const budget = await db.Budget.findOne({ where: { year: budgetYear } });

    if (!budget) return res.status(400).json({ message: `ไม่พบงบประมาณปี ${budgetYear}` });

    // ✅ ตรวจสอบว่างบพอหรือไม่
    const available = parseFloat(budget.initial_amount) - parseFloat(budget.used_amount);
    if (available < parseFloat(invoice.total_amount)) {
      return res.status(400).json({ message: 'งบประมาณไม่เพียงพอ' });
    }

    // ✅ บันทึกการชำระเงิน
    const payment = await db.Payment.create({
      invoice_id: invoice.id,
      po_id: invoice.po_id,
      vendor_id: invoice.vendor_id,
      amount: invoice.total_amount,
      payment_date,
      payment_method,
      payment_proof: file ? file.filename : null
    });

    // ✅ อัปเดตสถานะใบแจ้งหนี้
    await invoice.update({ status: 'paid' });

    // ✅ อัปเดตงบประมาณ (หักเงิน)
    budget.used_amount = parseFloat(budget.used_amount) + parseFloat(invoice.total_amount);
    await budget.save();

    res.status(201).json(payment);
  } catch (err) {
    console.error('❌ Payment error:', err);
    res.status(500).json({ message: err.message });
  }
};
