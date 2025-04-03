const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const { Pool } = require('pg'); // 👈 เพิ่ม
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/your_db_name',
});

const db = require('./models');

const itemRoutes = require('./routes/item.routes');
const vendorRoutes = require('./routes/vendor.routes');
const authRoutes = require('./routes/auth.routes');
const prRoutes = require('./routes/pr.routes');
const poRoutes = require('./routes/po.routes');
const assetRoutes = require('./routes/asset.routes');
const paymentRoutes = require('./routes/payment.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());

// ✅ Middleware ใส่ db (ต้องมาก่อนใช้ controller)
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/pr', prRoutes);
app.use('/api/po', poRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes); // << ใช้ req.db ตรงนี้
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/vendors', vendorRoutes);

// ✅ Root
app.get('/', (req, res) => res.send('✅ Purchase Management Backend Running'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// ✅ Start server
db.sequelize.sync({ alter: true }).then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Sequelize sync failed:', err);
});
