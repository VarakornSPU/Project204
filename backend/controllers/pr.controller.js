const db = require("../models");
const { PurchaseRequest, PRDetail, Item, User } = db;

// ✅ สร้างใบขอซื้อ PR
exports.createPR = async (req, res) => {
  try {
    const { pr_number, created_date, description, required_date, items } = req.body;
    const userId = req.user.id;

    const total_amount = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    const pr = await PurchaseRequest.create({
      pr_number,
      description,
      required_date,
      created_date,
      createdAt: new Date(created_date),
      updatedAt: new Date(created_date),
      total_amount,
      created_by: userId,
      status: "waiting_approval",
    });

    const detailData = items.map((item) => ({
      pr_id: pr.id,
      item_id: item.item_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      createdAt: new Date(created_date),
      updatedAt: new Date(created_date),
    }));

    await PRDetail.bulkCreate(detailData);

    const fullPR = await PurchaseRequest.findByPk(pr.id, {
      include: [
        { model: User, as: "created_user", attributes: ["first_name", "last_name"] },
        { model: PRDetail, as: "pr_details", include: [{ model: Item, as: "item" }] },
      ],
    });

    res.status(201).json(fullPR);
  } catch (error) {
    console.error("Create PR Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ สร้างเลข PR อัตโนมัติ
exports.generateNumber = async (req, res) => {
  const timestamp = Date.now();
  const prNumber = "PR" + timestamp;
  res.json({ pr_number: prNumber });
};

// ✅ ดึงใบขอซื้อทั้งหมด
exports.getAllPRs = async (req, res) => {
  try {
    const prs = await PurchaseRequest.findAll({
      include: [
        { model: User, as: "created_user", attributes: ["first_name", "last_name"] },
        { model: PRDetail, as: "pr_details", include: [{ model: Item, as: "item" }] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(prs);
  } catch (error) {
    console.error("Get All PRs Error:", error);
    res.status(500).json({ message: "Failed to fetch PRs" });
  }
};

// ✅ ดึงเฉพาะ PR ที่รออนุมัติ (สำหรับ Manager)
exports.getWaitingApprovalPRs = async (req, res) => {
  try {
    const prs = await PurchaseRequest.findAll({
      where: { status: "waiting_approval" },
      include: [
        { model: User, as: "created_user", attributes: ["first_name", "last_name"] },
        { model: PRDetail, as: "pr_details", include: [{ model: Item, as: "item" }] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(prs);
  } catch (error) {
    console.error("Get Waiting PR Error:", error);
    res.status(500).json({ message: "Failed to fetch pending PRs" });
  }
};

// ✅ อนุมัติ PR
exports.approvePR = async (req, res) => {
  try {
    const pr = await PurchaseRequest.findByPk(req.params.id);
    if (!pr || pr.status !== "waiting_approval") {
      return res.status(400).json({ message: "PR not found or already approved" });
    }

    pr.status = "approved";
    pr.approved_by = req.user.id;
    pr.approved_at = new Date();
    await pr.save();

    const fullPR = await PurchaseRequest.findByPk(pr.id, {
      include: [
        { model: User, as: "created_user", attributes: ["first_name", "last_name"] },
        { model: PRDetail, as: "pr_details", include: [{ model: Item, as: "item" }] },
      ],
    });

    res.json({ message: "PR Approved", pr: fullPR });
  } catch (err) {
    console.error("Approve PR Error:", err);
    res.status(500).json({ message: "Failed to approve PR" });
  }
};

exports.rejectPR = async (req, res) => {
  try {
    const pr = await PurchaseRequest.findByPk(req.params.id);
    if (!pr || pr.status !== "waiting_approval") {
      return res.status(400).json({ message: "PR not found or already processed" });
    }

    pr.status = "rejected";
    pr.rejected_by = req.user.id;
    pr.rejected_at = new Date();
    await pr.save();

    res.json({ message: "PR Rejected", pr });
  } catch (err) {
    console.error("Reject PR Error:", err);
    res.status(500).json({ message: "Failed to reject PR" });
  }
};

// ✅ ดึงเฉพาะ PR ที่ผ่านการอนุมัติ (เพื่อใช้สร้าง PO)
exports.getApprovedPRs = async (req, res) => {
  try {
    const prs = await PurchaseRequest.findAll({
      where: { status: 'approved' },
      include: [
        { model: User, as: 'created_user', attributes: ['first_name', 'last_name'] },
        { model: PRDetail, as: 'pr_details', include: [{ model: Item, as: 'item' }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(prs);
  } catch (error) {
    console.error("Get Approved PR Error:", error);
    res.status(500).json({ message: "Failed to fetch approved PRs" });
  }
};

// ✅ GET PR ที่อนุมัติแล้ว และยังไม่มี PO
exports.getAvailablePRsForPO = async (req, res) => {
  try {
    const approvedPRs = await db.PurchaseRequest.findAll({
      where: { status: 'approved' },
      include: [
        {
          model: db.PurchaseOrder,
          required: false, // left join
        },
      ],
    });

    const availablePRs = approvedPRs.filter(pr => !pr.PurchaseOrder);
    res.json(availablePRs);
  } catch (err) {
    console.error('[GET AVAILABLE PRs]', err);
    res.status(500).json({ message: 'Failed to fetch available PRs' });
  }
};

// ✅ GET PR ที่อนุมัติแล้ว และยังไม่มี PO
exports.getAvailablePRsForPO = async (req, res) => {
  try {
    const prs = await db.PurchaseRequest.findAll({
      where: { status: 'approved' },
      include: [
        {
          model: db.PurchaseOrder,
          required: false, // LEFT JOIN
        },
        {
          model: db.User,
          as: 'created_user',
          attributes: ['first_name', 'last_name']
        },
        {
          model: db.PRDetail,
          as: 'pr_details',
          include: [{ model: db.Item, as: 'item' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // filter PR ที่ยังไม่มี PO
    const available = prs.filter(pr => !pr.PurchaseOrder);
    res.json(available);
  } catch (err) {
    console.error('[GET AVAILABLE PRs]', err);
    res.status(500).json({ message: 'Failed to fetch available PRs' });
  }
};


