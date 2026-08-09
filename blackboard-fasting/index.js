require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 8080;

// State holding the 5 JSON panels
let panelsData = {
  commentaires_non_repondus: [],
  derniers_emails: [],
  derniers_users: [],
  ventes_stripe_7j: [],
  GSC_fasting_fr_28j: []
};

// Initialize Stripe (if key is missing, mock it or leave undefined, handled in function)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // or latest
}) : null;

async function fetchStripeSales24h() {
  if (!process.env.STRIPE_SECRET_KEY || !stripe) {
    console.warn('STRIPE_SECRET_KEY is missing. Skipping Stripe fetch.');
    return [];
  }

  try {
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);

    // Fetch successful charges from the last 24h
    const charges = await stripe.charges.list({
      created: { gte: twentyFourHoursAgo },
      limit: 100, // Reasonable max limit per panel for 24h
    });

    // We filter for successful payments
    const successfulCharges = charges.data.filter(charge => charge.status === 'succeeded' && charge.paid);

    return successfulCharges.map(charge => ({
      id: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      created: charge.created,
      receipt_email: charge.receipt_email,
    }));
  } catch (err) {
    console.error('Error fetching Stripe sales:', err);
    return [];
  }
}

// Function to refresh the data
async function refreshData() {
  console.log(`[${new Date().toISOString()}] Refreshing panels data...`);
  try {
    // TODO: Implement actual data fetching logic for each panel here.
    // For now, we update with placeholder/mock data or just keep structure.

    const stripeSales = await fetchStripeSales24h();
    panelsData.ventes_stripe_7j = stripeSales; // Keeping key to match existing structure

    console.log(`[${new Date().toISOString()}] Data refreshed successfully.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error refreshing data:`, error);
  }
}

// Initial data fetch
refreshData();

// Schedule the refresh function to run every 15 minutes
cron.schedule('*/15 * * * *', () => {
  refreshData();
});

// Endpoint to retrieve the current state of the panels
app.get('/', (req, res) => {
  res.json(panelsData);
});

// Start the Express server
app.listen(port, () => {
  console.log(`blackboard-fasting service listening on port ${port}`);
});
