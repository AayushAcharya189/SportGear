const mongoose = require("mongoose"); // Importing mongoose to create schemas and work with MongoDB

// Define a schema (structure) for contact form data
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Name field, must be a string and required
  email: { type: String, required: true },     // Email field, must be a string and required
  message: { type: String, required: true },   // Message field, must be a string and required
  createdAt: { type: Date, default: Date.now } // Date when contact was created, default is current date/time
});

// Exporting the schema as a model named "Contact" to use in other parts of the app
module.exports = mongoose.model("Contact", contactSchema);
