//For models
const mongoose = require('mongoose');

// TaxPayer schema
const taxPayerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  tin: { type: String, required: true, unique: true },
});

// Asset schema
const assetSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  ownersTIN: { type: String, required: true },
  assetType: { type: String, enum: ['Fixed', 'Movable'], required: true },
  assetCode: { type: String, required: true, unique: true },
});

// Create models
const TaxPayer = mongoose.model('TaxPayer', taxPayerSchema);
const Asset = mongoose.model('Asset', assetSchema);

// Export models
module.exports = {
  TaxPayer,
  Asset,
};
