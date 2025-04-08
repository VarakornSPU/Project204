const db = require("../models");

exports.getAllStockItems = async (req, res) => {
  try {
    const stockItems = await db.StockItem.findAll({
      include: [{ model: db.Item }],
      order: [['id', 'ASC']]
    });

    const result = stockItems.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      item_name: item.Item?.name || null
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
