// Project204/backend/controllers/invoice.controller.js
const db = require('../models');
const { Op } = require('sequelize');
const Invoice = db.Invoice;
const PurchaseOrder = db.PurchaseOrder;
const Vendor = db.Vendor;

exports.createInvoice = async (req, res) => {
  try {
    const {
      po_id,
      vendor_id,
      invoice_number,
      invoice_date,
      due_date,
      total_amount,
      status
    } = req.body;

    const invoice = await Invoice.create({
      po_id,
      vendor_id,
      invoice_number,
      invoice_date,
      due_date,
      total_amount,
      status
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: ['po', 'vendor']
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPOs = async (req, res) => {
  try {
    const usedInvoices = await Invoice.findAll({ attributes: ['po_id'] });
    const usedPoIds = usedInvoices.map(inv => inv.po_id);

    const pos = await PurchaseOrder.findAll({
      where: {
        status: 'pending',
        id: {
          [Op.notIn]: usedPoIds
        }
      }
    });

    res.json(pos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getNextInvoiceNumber = async (req, res) => {
    try {
      const lastInvoice = await Invoice.findOne({
        order: [['created_at', 'DESC']]
      });
  
      let nextNumber = 1;
      if (lastInvoice && lastInvoice.invoice_number) {
        const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
  
      const nextInvoiceNumber = `INV-${String(nextNumber).padStart(5, '0')}`;
      res.json({ invoice_number: nextInvoiceNumber });
    } catch (err) {
      console.error('❌ Error generating invoice number:', err);
      res.status(500).json({ message: err.message });
    }
  };
  