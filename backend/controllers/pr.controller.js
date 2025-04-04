const db = require('../models');

// 🔹 สร้าง PR
exports.createPR = async (req, res) => {
  const { description, items, required_date } = req.body;
  const userId = req.user?.id;

  const parsedRequiredDate = required_date ? new Date(required_date) : new Date();

  try {
    const pr = await db.PurchaseRequest.create({
      pr_number: `PR${Date.now()}`,
      description,
      required_date: parsedRequiredDate, // ถูกส่งไปยังฐานข้อมูล
      status: 'draft',
      total_amount: 0,
      created_by: userId
    });

    let total = 0;

    for (const item of items) {
      const itemData = await db.Item.findByPk(item.item_id);
      const unit_price = item.unit_price || itemData.unit_price;
      const totalPrice = item.quantity * unit_price;
      total += totalPrice;

      await db.PRDetail.create({
        pr_id: pr.id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: unit_price,
        total_price: totalPrice
      });
    }

    await pr.update({ total_amount: total });

    res.json({ message: 'สร้าง PR แล้ว', pr_number: pr.pr_number });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
  }
};

// 🔹 ดึงข้อมูล PR ทั้งหมด
exports.getAllPRs = async (req, res) => {
  try {
    const prs = await db.PurchaseRequest.findAll({
      include: [
        {
          model: db.PRDetail,
          include: [db.Item]
        },
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(prs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล PR ได้', error: err });
  }
};

// 🔹 ดึงข้อมูล PR ตาม ID
exports.getPRById = async (req, res) => {
  try {
    const pr = await db.PurchaseRequest.findByPk(req.params.id, {
      include: [
        {
          model: db.PRDetail,
          include: [db.Item]
        },
      ]
    });

    if (!pr) return res.status(404).json({ message: 'PR not found' });

    res.json(pr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch PR', error: err.message });
  }
};
