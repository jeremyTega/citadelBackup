const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Adjust the path to server.js since it's outside the functions directory
const app = require("../server"); // This assumes that server.js is one level above the functions folder

// Create the Firebase function to handle requests
exports.api = onRequest((req, res) => {
  logger.info("API request received", { structuredData: true });
  app(req, res); // Pass the request and response to your Express app
});
