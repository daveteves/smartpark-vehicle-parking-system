const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const coreRoutes = require('./routes/coreRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes');
const auditAndSpotsRoutes = require('./routes/auditAndSpotsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const financeRoutes = require('./routes/financeRoutes');

app.use('/api/core', require('./routes/coreRoutes'));
app.use('/api/masterdata', require('./routes/masterDataRoutes'));
app.use('/api/audit-and-spots', require('./routes/auditAndSpotsRoutes'));
app.use('/api/transactions', require('./routes/transactionsRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the SmartPark API' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`SmartPark Server running on port ${PORT}`));
