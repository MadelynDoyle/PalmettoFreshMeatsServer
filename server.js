const express = require('express');
const Joi = require('joi');
const cors = require('cors');
const app = express();
app.use(express.json()); // Needed to parse JSON body
app.use(cors());

let beef = require('./data/products.json'); // In-memory data

// Joi schema
const beefSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().uri().required()
});

// POST route to add beef product
app.post('/api/beef', (req, res) => {
  const { error, value } = beefSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newProduct = { ...value, _id: Date.now().toString() }; // Simulate ID
  beef.push(newProduct);
  res.status(201).json(newProduct);
});
