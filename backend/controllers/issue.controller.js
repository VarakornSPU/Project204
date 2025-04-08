const db = require("../models");
const IssueRequest = db.IssueRequest;
const IssueDetail = db.IssueDetail;
const StockItem = db.StockItem;

exports.createIssue = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "กรุณาเลือกพัสดุอย่างน้อย 1 รายการ" });
    }

    const request = await IssueRequest.create({
      requester_id: userId,
      status: "approved"
    });

    for (const item of items) {
      await IssueDetail.create({
        issue_request_id: request.id,
        stock_item_id: item.stock_item_id,
        quantity: item.quantity
      });

      const stock = await StockItem.findByPk(item.stock_item_id);
      if (!stock || stock.quantity < item.quantity) {
        throw new Error("จำนวนในคลังไม่เพียงพอ");
      }

      stock.quantity -= item.quantity;
      await stock.save();
    }

    res.status(201).json({ message: "เบิกพัสดุเรียบร้อย", request });
  } catch (err) {
    console.error("❌ CREATE ISSUE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const issues = await IssueRequest.findAll({
      include: [
        { model: db.User, as: "requester" },
        { model: db.IssueDetail, as: "details" }
      ]
    });
    res.json(issues);
  } catch (err) {
    console.error("❌ GET ISSUES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
