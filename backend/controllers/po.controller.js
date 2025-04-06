const db = require('../models');
const { PurchaseOrder, POItem, PurchaseRequest, Vendor } = db;

exports.createPO = async (req, res) => {
  const { pr_id, vendor_id, payment_terms, reference_no, items } = req.body;

  try {
    console.log('📥 CREATE PO BODY:', req.body);

    if (!pr_id || !vendor_id || !payment_terms || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ ย้ายมาใส่ตรงนี้
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
      stack: err.stack,
    });
  }
};


// ✅ GET ALL POs
exports.getAllPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.findAll({
      include: [{ model: Vendor, attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
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

// ✅ GET PO BY ID
exports.getPOById = async (req, res) => {
  const { id } = req.params;

  try {
    const po = await PurchaseOrder.findByPk(id, {
      include: [
        {
          model: POItem,
          as: 'items',
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
