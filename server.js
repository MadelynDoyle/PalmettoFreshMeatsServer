const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");



mongoose.connect("mongodb+srv://Administrator:RMFPassword@rmfinder.73vke.mongodb.net/RoommateFinderData");

const Beef = require("./models/Beef");
const Pork = require("./models/Pork");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/",(req, res)=>{
  res.sendFile(__dirname+"/index.html");
});



app.get("/api/beef", async (req, res) => {
  const beef = await Beef.find();
  res.send(beef);
});

app.get("/api/pork", async (req, res) => {
  const pork = await Pork.find();
  res.send(pork);
});


app.post("/api/beef", upload.single("img"), async (req, res) => {
  const result = validateProducts(req.body);
  if (result.error) return res.status(400).send(result.error.details[0].message);

  try {
    const beef = new Beef({
      name: req.body.name,
      cutDescription: req.body.cutDescription,
      averageWeight: req.body.averageWeight,
      pricePerPound: req.body.pricePerPound,
      image: req.file ? "images/" + req.file.filename : ""
    });

    const savedBeef = await beef.save(); // Save and catch any errors

    res.status(201).send(savedBeef);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error saving beef product" });
  }
});



app.post("/api/pork", upload.single("img"), async (req, res) => {
  const result = validatePork(req.body);
  if (result.error) return res.status(400).send(result.error.details[0].message
  );

  const pork = new Pork({
    name: req.body.name,
    cutDescription: req.body.cutDescription,
    averageWeight: req.body.averageWeight,
    pricePerPound: req.body.pricePerPound,
    image: req.file ? "images/" + req.file.filename : ""
  });

  await pork.save();
  res.send(pork);
});


app.put("/api/beef/:id", async (req, res) => {
  const { id } = req.params;
  const result = validateProducts(req.body);
  if (result.error) return res.status(400).send(result.error.details[0].message);

  try {
    const updatedBeef = await Beef.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBeef) return res.status(404).send("Product not found.");
    res.send(updatedBeef);
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
});

app.delete("/api/beef/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBeef = await Beef.findByIdAndDelete(id);
    if (!deletedBeef) return res.status(404).send("Product not found.");
    res.send(deletedBeef);
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
});




const validateProducts = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    cutDescription: Joi.string().required(),
    averageWeight: Joi.string().required(),
    pricePerPound: Joi.string().required(), 
    image: Joi.string().allow("")
  });

  return schema.validate(product);
};


const validatePork = (pork) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    cutDescription: Joi.string().required(),
    averageWeight: Joi.string().required(),
    pricePerPound: Joi.string().required(),
    image: Joi.string().allow("")
  });

  return schema.validate(pork);
};


app.listen(3001, ()=>{
  console.log("I'm listening");
});
