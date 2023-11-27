// Express server here.
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { TaxPayer, Asset } = require('./models'); // Assuming models.js is in the same directory

const app = express();
const PORT = 3001;

// Connect to MongoDB (replace 'YOUR_MONGODB_URI' with your actual MongoDB URI)
mongoose.connect('mongodb+srv://masirika:goma2023.com@cluster0.hqy9pky.mongodb.net/URA?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to URA MongoDB');
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Register TaxPayer route
app.post('/registerTaxPayer', async (req, res) => {
  try {
    const { fullName, dateOfBirth, phoneNumber, address } = req.body;

    // Generate TIN (Tax Identification Number)
    const tin = generateTIN();

    const newTaxPayer = new TaxPayer({ fullName, dateOfBirth, phoneNumber, address, tin });
    await newTaxPayer.save();

    console.log('Tax Payer registered successfully:', newTaxPayer);
    res.json({ message: 'Tax Payer registered successfully', taxPayer: newTaxPayer });
  } catch (error) {
    console.error('Error registering tax payer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register Asset route
app.post('/registerAsset', async (req, res) => {
  try {
    const { assetName, estimatedCost, ownersTIN, assetType } = req.body;

    // Generate Asset Code
    const assetCode = generateAssetCode(ownersTIN);

    // Check if the assetCode is unique
    const existingAsset = await Asset.findOne({ assetCode });
    if (existingAsset) {
      console.error('Asset with this code already exists:', assetCode);
      return res.status(400).json({ error: 'Asset with this code already exists' });
    }

    const newAsset = new Asset({ assetName, estimatedCost, ownersTIN, assetType, assetCode });
    await newAsset.save();

    console.log('Asset registered successfully:', newAsset);
    res.json({ message: 'Asset registered successfully', asset: newAsset });
  } catch (error) {
    console.error('Error registering asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (other routes remain the same)

// Helper function to generate a random TIN
function generateTIN() {
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  return 'TIN' + randomDigits.substring(0, 9);
}

// Helper function to generate an asset code based on the given criteria
function generateAssetCode(ownersTIN) {
  const uniqueCode = ownersTIN.slice(-3); // Last three numbers of owner's TIN
  const alphabetCode = 'A'; // Fixed alphabet code at the start

  return alphabetCode + uniqueCode;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
