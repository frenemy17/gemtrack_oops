// backend/src/controllers/marketController.js
const axios = require('axios');

// @route   GET /api/market/rates
// @desc    Get live metal market rates
// @access  Private
exports.getMarketRates = async (req, res) => {
  try {
    // Use the provided API key directly or from env
    const apiKey = process.env.GOLD_API_KEY || 'goldapi-3gssmipo4jj7-io';

    const myHeaders = {
      "x-access-token": apiKey,
      "Content-Type": "application/json"
    };

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    // Fetch Gold (XAU) and Silver (XAG) in INR
    // Using native fetch as per user suggestion and successful test
    const [goldResponse, silverResponse] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/INR", requestOptions),
      fetch("https://www.goldapi.io/api/XAG/INR", requestOptions)
    ]);

    if (!goldResponse.ok) {
      const errorText = await goldResponse.text();
      console.error(`Gold API Error (${goldResponse.status}): ${errorText}`);
      return res.json({
        success: false,
        message: `Gold API Error: ${goldResponse.status} ${goldResponse.statusText}`,
        details: errorText,
        rates: null
      });
    }
    if (!silverResponse.ok) {
      const errorText = await silverResponse.text();
      console.error(`Silver API Error (${silverResponse.status}): ${errorText}`);
      return res.json({
        success: false,
        message: `Silver API Error: ${silverResponse.status} ${silverResponse.statusText}`,
        details: errorText,
        rates: null
      });
    }

    const goldData = await goldResponse.json();
    const silverData = await silverResponse.json();

    // Helper to safely parse rate
    const parseRate = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    const gold24k = parseRate(goldData.price_gram_24k);
    const gold22k = parseRate(goldData.price_gram_22k);
    const silver24k = parseRate(silverData.price_gram_24k);

    if (gold24k !== null && gold22k !== null && silver24k !== null) {
      const realData = {
        success: true,
        base_currency: "INR",
        timestamp: new Date().toISOString(),
        rates: {
          gold_24k_10gm: (gold24k * 10).toFixed(2),
          gold_22k_10gm: (gold22k * 10).toFixed(2),
          silver_1kg: (silver24k * 1000).toFixed(2),
          platinum_1gm: 3200.00
        }
      };
      return res.json(realData);
    }

    console.warn("GoldAPI returned incomplete data:", { goldData, silverData });
    return res.json({
      success: false,
      message: "GoldAPI returned incomplete data",
      rates: null
    });
  } catch (error) {
    console.error('Error fetching market rates:', error.message);
    // Return null rates on error instead of mock data
    res.json({
      success: false,
      message: "Error fetching market rates",
      rates: null
    });
  }
};



exports.getMarketNews = async (req, res) => {
  try {
    const newsData = [
      {
        id: 1,
        title: "Gold prices stabilize ahead of wedding season",
        source: "Financial Express",
        date: new Date().toISOString().split('T')[0],
        summary: "Demand for yellow metal is expected to rise significantly..."
      },
      {
        id: 2,
        title: "New Hallmarking rules: What jewelers need to know",
        source: "Jewelry Standard",
        date: "2023-10-26",
        summary: "The government has mandated 6-digit HUID for all gold jewelry..."
      },
      {
        id: 3,
        title: "Silver imports hit 5-year high in Q3",
        source: "Market Watch",
        date: "2023-10-25",
        summary: "Industrial demand coupled with investment buying pushes imports..."
      }
    ];
    res.json(newsData);
  } catch (error) {
    console.error("Error fetching market news", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};