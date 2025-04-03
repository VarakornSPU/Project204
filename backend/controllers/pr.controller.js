const db = require('../models');

exports.createPR = async (req, res) => {
  const { description, items } = req.body;

  try {
    const pr = await db.PurchaseRequest.create({
      pr_number: `PR${Date.now()}`,
      description,
      status: 'draft',
      total_amount: 0
    });

    let total = 0;

    for (const item of items) {
      const itemData = await db.Item.findByPk(item.item_id);
      const totalPrice = item.quantity * itemData.unit_price;
      total += totalPrice;

      await db.PRDetail.create({
        pr_id: pr.id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: itemData.unit_price,
        total_price: totalPrice
      });
    }

    await pr.update({ total_amount: total });

    res.json({ message: 'สร้าง PR แล้ว', pr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
  }
};

exports.getAllPRs = async (req, res) => {
  try {
    const prs = await db.PurchaseRequest.findAll({
      include: {
        model: db.PRDetail,
        include: db.Item
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(prs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล PR ได้', error: err });
  }
};

exports.getPRById = async (req, res) => {
  const { id } = req.params;

  try {
    const pr = await db.PurchaseRequest.findByPk(id, {
      include: {
        model: db.PRDetail,
        include: db.Item
      }
    });

    if (!pr) {
      return res.status(404).json({ message: 'PR ไม่พบ' });
    }

    res.json(pr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล PR นี้ได้', error: err });
  }
  
};

exports.getPRById = async (req, res) => {
  try {
    const pr = await db.PurchaseRequest.findByPk(req.params.id, {
      include: [
        {
          model: db.PRDetail,
          include: [db.Item]
        }
      ]
    });

    if (!pr) return res.status(404).json({ message: 'PR not found' });

    res.json(pr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch PR', error: err.message });
  }
};