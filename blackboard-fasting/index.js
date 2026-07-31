const express = require('express');
const cron = require('node-cron');

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

// Function to refresh the data
async function refreshData() {
  console.log(`[${new Date().toISOString()}] Refreshing panels data...`);
  try {
    // TODO: Implement actual data fetching logic for each panel here.
    // For now, we update with placeholder/mock data or just keep structure.

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
