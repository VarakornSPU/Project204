module.exports = app => {
    const receipts = require("../controllers/receipt.controller");
    const router = require("express").Router();
  
    router.post("/", receipts.createReceipt);
    router.get("/", receipts.getReceipts);
  
    app.use("/api/receipts", router);
  };
  