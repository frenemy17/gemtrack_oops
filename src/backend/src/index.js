require('dotenv').config();
const express = require("express")
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items')
const customerRoutes = require('./routes/customer')
const saleRoutes = require('./routes/sale')
const marketRoutes = require('./routes/market')
const dashboardRoutes = require('./routes/dashboard')
const shopRoutes = require('./routes/shop')
const app = express()
const prisma = require('./prismaClient');
const cors = require('cors');

const PORT = process.env.PORT || 3001;



app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes)
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shop', shopRoutes);
async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.send('Jewelry Manager API is running!');
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectToDatabase();
  });
}

module.exports = app;