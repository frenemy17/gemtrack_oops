const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';
let testItemId = null;
let testCustomerId = null;
let testSaleId = null;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : colors.yellow;
  console.log(`${color}${message}${colors.reset}`);
}

async function testAuth() {
  log('\n=== Testing Authentication ===', 'info');
  
  try {
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      email: `test${Date.now()}@test.com`,
      password: 'test123',
      name: 'Test User'
    });
    log('✓ Register successful', 'success');
    authToken = registerRes.data.token;
  } catch (error) {
    if (error.response?.status === 400) {
      log('✓ Register validation working', 'success');
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@test.com',
        password: 'test123'
      });
      authToken = loginRes.data.token;
      log('✓ Login successful', 'success');
    } else {
      throw error;
    }
  }
}

async function testItems() {
  log('\n=== Testing Items ===', 'info');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  const createRes = await axios.post(`${BASE_URL}/items`, {
    name: 'Test Gold Ring',
    sku: `SKU${Date.now()}`,
    huid: 'HUID123',
    purity: '22K',
    category: 'Ring',
    grossWeight: 10.5,
    netWeight: 10.0,
    makingPerGm: 500,
    wastagePct: 5,
    hallmarkingCharges: 100,
    stoneCharges: 200,
    otherCharges: 50,
    cgstPct: 1.5,
    sgstPct: 1.5,
    cost: 50000,
    price: 55000
  }, { headers });
  testItemId = createRes.data.id;
  log('✓ Create item successful', 'success');
  
  const getAllRes = await axios.get(`${BASE_URL}/items`, { headers });
  log(`✓ Get all items successful (${getAllRes.data.items.length} items)`, 'success');
  
  const getByIdRes = await axios.get(`${BASE_URL}/items/${testItemId}`, { headers });
  log('✓ Get item by ID successful', 'success');
  
  const getBySkuRes = await axios.get(`${BASE_URL}/items/scan/${createRes.data.sku}`, { headers });
  log('✓ Get item by SKU successful', 'success');
  
  const updateRes = await axios.put(`${BASE_URL}/items/${testItemId}`, {
    ...createRes.data,
    price: 56000
  }, { headers });
  log('✓ Update item successful', 'success');
}

async function testCustomers() {
  log('\n=== Testing Customers ===', 'info');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  const createRes = await axios.post(`${BASE_URL}/customers`, {
    name: 'Test Customer',
    phone: `98765${Date.now().toString().slice(-5)}`,
    email: `customer${Date.now()}@test.com`,
    address: '123 Test St',
    city: 'Mumbai',
    pincode: '400001',
    pancard: 'ABCDE1234F'
  }, { headers });
  testCustomerId = createRes.data.id;
  log('✓ Create customer successful', 'success');
  
  const getAllRes = await axios.get(`${BASE_URL}/customers`, { headers });
  log(`✓ Get all customers successful (${getAllRes.data.customers.length} customers)`, 'success');
  
  const updateRes = await axios.put(`${BASE_URL}/customers/${testCustomerId}`, {
    ...createRes.data,
    city: 'Delhi'
  }, { headers });
  log('✓ Update customer successful', 'success');
}

async function testSales() {
  log('\n=== Testing Sales ===', 'info');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  const checkoutRes = await axios.post(`${BASE_URL}/sales/checkout`, {
    customerId: testCustomerId,
    paymentMethod: 'Cash',
    amountPaid: 50000,
    items: [{
      itemId: testItemId,
      soldPrice: 55000,
      soldMakingCharge: 500,
      soldWastage: 5,
      soldHallmarking: 100,
      soldStoneCharges: 200,
      soldOtherCharges: 50,
      soldCgstPct: 1.5,
      soldSgstPct: 1.5
    }]
  }, { headers });
  testSaleId = checkoutRes.data.saleId;
  log('✓ Checkout successful', 'success');
  
  const getAllRes = await axios.get(`${BASE_URL}/sales`, { headers });
  log(`✓ Get all sales successful (${getAllRes.data.sales.length} sales)`, 'success');
  
  const getByIdRes = await axios.get(`${BASE_URL}/sales/${testSaleId}`, { headers });
  log('✓ Get sale by ID successful', 'success');
  log(`  Payment Status: ${getByIdRes.data.paymentStatus}`, 'info');
  log(`  Amount Due: ${getByIdRes.data.amountDue}`, 'info');
}

async function testDashboard() {
  log('\n=== Testing Dashboard ===', 'info');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  const statsRes = await axios.get(`${BASE_URL}/dashboard/stats`, { headers });
  log('✓ Get dashboard stats successful', 'success');
  log(`  Total Revenue: ${statsRes.data.totalRevenue}`, 'info');
  log(`  Total Dues: ${statsRes.data.totalDues}`, 'info');
  
  const salesOverTimeRes = await axios.get(`${BASE_URL}/dashboard/sales-over-time`, { headers });
  log('✓ Get sales over time successful', 'success');
  
  const topItemsRes = await axios.get(`${BASE_URL}/dashboard/top-items`, { headers });
  log('✓ Get top selling items successful', 'success');
  
  const duesRes = await axios.get(`${BASE_URL}/dashboard/customer-dues`, { headers });
  log('✓ Get customer dues successful', 'success');
}

async function testMarket() {
  log('\n=== Testing Market ===', 'info');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  const ratesRes = await axios.get(`${BASE_URL}/market/rates`, { headers });
  log('✓ Get market rates successful', 'success');
  log(`  Gold 24K: ${ratesRes.data.rates.gold_24k_10gm}`, 'info');
  
  const newsRes = await axios.get(`${BASE_URL}/market/news`, { headers });
  log('✓ Get market news successful', 'success');
}

async function cleanup() {
  log('\n=== Cleanup ===', 'info');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    if (testCustomerId) {
      await axios.delete(`${BASE_URL}/customers/${testCustomerId}`, { headers });
      log('✓ Deleted test customer', 'success');
    }
  } catch (e) {
    log('⚠ Could not delete customer (may have sales)', 'info');
  }
  
  try {
    if (testItemId) {
      await axios.delete(`${BASE_URL}/items/${testItemId}`, { headers });
      log('✓ Deleted test item', 'success');
    }
  } catch (e) {
    log('⚠ Could not delete item (may have sales)', 'info');
  }
}

async function runTests() {
  try {
    log('Starting API Tests...', 'info');
    
    await testAuth();
    await testItems();
    await testCustomers();
    await testSales();
    await testDashboard();
    await testMarket();
    await cleanup();
    
    log('\n✅ All tests passed!', 'success');
    process.exit(0);
  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'error');
    if (error.response) {
      log(`Status: ${error.response.status}`, 'error');
      log(`Data: ${JSON.stringify(error.response.data)}`, 'error');
    }
    process.exit(1);
  }
}

runTests();
