// Project204/backend/routes/invoice.routes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, invoiceController.createInvoice);
router.get('/', authenticate, invoiceController.getAllInvoices);
router.get('/pos', authenticate, invoiceController.getPOs);
router.get('/vendors', authenticate, invoiceController.getVendors);
router.get('/next-number', authenticate, invoiceController.getNextInvoiceNumber);


module.exports = router;
