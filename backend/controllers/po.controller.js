const db = require('../models');
const { PurchaseOrder, POItem, PurchaseRequest, Vendor, Budget, Payment } = db;

exports.createPO = async (req, res) => {
  const { pr_id, vendor_id, payment_terms, reference_no, items } = req.body;

  try {
    if (!pr_id || !vendor_id || !payment_terms || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingPO = await PurchaseOrder.findOne({ where: { pr_id } });
    if (existingPO) {
      return res.status(400).json({
        message: `PR ID ${pr_id} has already been used to create a PO.`,
      });
    }

    const pr = await PurchaseRequest.findByPk(pr_id);
    if (!pr) {
      return res.status(400).json({ message: `PR ID ${pr_id} does not exist` });
    }

    const vendor = await Vendor.findByPk(vendor_id);
    if (!vendor) {
      return res.status(400).json({ message: `Vendor ID ${vendor_id} does not exist` });
    }

    const ref = reference_no || 'PO' + Date.now();
    const total_amount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    const year = new Date().getFullYear();
    const budget = await Budget.findOne({ where: { year } });
    if (!budget) {
      return res.status(400).json({ message: 'ยังไม่ได้ตั้งค่างบประมาณประจำปี' });
    }

    if (parseFloat(budget.used_amount) + total_amount > parseFloat(budget.initial_amount)) {
      return res.status(400).json({ message: 'งบประมาณบริษัทไม่เพียงพอ' });
    }

    const po = await PurchaseOrder.create({
      pr_id,
      vendor_id,
      payment_terms,
      reference_no: ref,
      total_amount,
      status: 'pending',
    });

    for (const item of items) {
      await POItem.create({
        po_id: po.id,
        description: item.description,
        unit: item.unit,
        unit_price: parseFloat(item.unit_price),
        quantity: parseInt(item.quantity),
        amount: parseFloat(item.amount),
        required_date: new Date(),
      });
    }

    res.status(201).json({
      message: 'PO created successfully',
      po_id: po.id,
      reference_no: po.reference_no,
    });

  } catch (err) {
    console.error('[CREATE PO ERROR]', err);
    res.status(500).json({
      message: 'Failed to create PO',
      error: err.message,
    });
  }
};

exports.getAllPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.findAll({
      include: [{ model: Vendor, attributes: ['name'] }],
      order: [['id', 'DESC']],
    });

    const formatted = pos.map(po => ({
      ...po.toJSON(),
      vendor_name: po.Vendor?.name || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[GET ALL POs ERROR]', err);
    res.status(500).json({
      message: 'Failed to fetch POs',
      error: err.message,
    });
  }
};

exports.getPOById = async (req, res) => {
  const { id } = req.params;

  try {
    const po = await PurchaseOrder.findByPk(id, {
      include: [
        {
          model: POItem,
          as: 'items',
        },
        {
          model: Vendor, // ✅ เพิ่มตรงนี้
          attributes: ['name'],
        },
      ],
    });

    if (!po) {
      return res.status(404).json({ message: 'PO not found' });
    }

    res.json(po);
  } catch (err) {
    console.error('[GET PO BY ID ERROR]', err);
    res.status(500).json({
      message: 'Failed to fetch PO',
      error: err.message,
    });
  }
};

// ✅ ใหม่: ดึงเฉพาะ PO ที่มีการชำระเงินแล้ว
exports.getPaidPOs = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{
        model: PurchaseOrder,
        include: [{ model: Vendor }],
        attributes: ['po_number', 'date', 'total_amount'],
      }],
    });

    const data = payments.map(payment => ({
      po_number: payment.PurchaseOrder.po_number,
      date: payment.PurchaseOrder.date,
      vendor_name: payment.PurchaseOrder.Vendor?.name || 'ไม่ทราบ',
      total_amount: payment.PurchaseOrder.total_amount,
    }));

    res.json(data);
  } catch (error) {
    console.error('getPaidPOs error:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล PO ที่จ่ายเงินแล้วได้', error: error.message });
  }
};
