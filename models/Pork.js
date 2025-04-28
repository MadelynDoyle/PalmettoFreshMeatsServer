
const mongoose = require('mongoose');

const PorkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cutDescription: { type: String, required: true },
  averageWeight: { type: String, required: true },
  pricePerPound: { type: String, required: true },
  image: { type: String }
});

module.exports = mongoose.model('Pork', PorkSchema);
