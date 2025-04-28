const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


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


let Products = [
  {
      "_id" : "1",
      "name" : "Brisket",
      "cutDescription" : "From the brest or lower chest of the cow",
      "averageWeight" : "10 to 16 pounds",
      "pricePerPound" : "$10.99 per pound",
      "image" : "images/Brisket.jpg"
  },
  {
      "_id" : "2",
      "name" : "Hanger Steak",
      "cutDescription" : "Known as the butcher's steak because there is only one per cow.",
      "averageWeight" : "2 to 3 pounds",
      "pricePerPound" : "$16.49 per pound",
      "image" : "images/HangerSteak.jpeg"
  },
  {
      "_id" : "3",
      "name" : "Short Ribs",
      "cutDescription" : "Taken from the rib of the cow.",
      "averageWeight" : "2 to 3 pounds",
      "pricePerPound" : "$8.29 per pound",
      "image" : "images/BeefShortRibs.jpg"
  },
  {
      "_id" : "4",
      "name" : "Cubed Steak",
      "cutDescription" : "Taken from the top sirloin and tenderized.",
      "averageWeight" : "1 to 2 pounds per package",
      "pricePerPound" : "$8.49 per pound",
      "image" : "images/CubedSteak.jpg"
  },
  {
      "_id" : "5",
      "name" : "Chuck Roast",
      "cutDescription" : "A cut of beef from the shoulder or neck of the cow.",
      "averageWeight" : "2 to 3 pounds per package",
      "pricePerPound" : "$10.49 per pound",
      "image" : "images/ChuckRoast.jpg"
  }

]

let Pork = [
  {
      "_id" : "1",
      "name" : "Porkchops",
      "cutDescription" : "A loin cut near the spine of the pig.",
      "averageWeight" : "10-12 ounces",
      "pricePerPound" : "$2.98 per pound",
      "image" : "images/Porkchops2.jpg"
  },
  {
      "_id" : "2",
      "name" : "Ground Pork",
      "cutDescription" : "Made up of teh trimmings of the hog.",
      "averageWeight" : "1 to 2 pound packages",
      "pricePerPound" : "$4.99 per pound",
      "image" : "images/GroundPork.jpg"
  },
  {
      "_id" : "3",
      "name" : "Bacon",
      "cutDescription" : "Made from the belly of the hog.",
      "averageWeight" : "1 pound packages",
      "pricePerPound" : "$7.99 per pound",
      "image" : "images/Bacon.jpg"
  },
  {
      "_id" : "4",
      "name" : "Fat Back",
      "cutDescription" : "Taken from along the backbone of the hog.",
      "averageWeight" : "1 to 2 pound packages",
      "pricePerPound" : "$5.00 per pound",
      "image" : "images/PorkFatBack.jpg"
  },
  {
      "_id" : "5",
      "name" : "Pork Tenderloin",
      "cutDescription" : "From the muscle that rund along the backbone of the hog.",
      "averageWeight" : "1 pound packages",
      "pricePerPound" : "$6.25 per pound",
      "image" : "images/PorkTenderloin.jpg"
  }
]

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

  const beef = new Beef({
    name: req.body.name,
    cutDescription: req.body.cutDescription,
    averageWeight: req.body.averageWeight,
    pricePerPound: req.body.pricePerPound,
    image: req.file ? "images/" + req.file.filename : ""
  });

  await beef.save();
  res.send(beef);
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





app.put("/api/beef/:id", (req, res) => {
  const { id } = req.params;
  const result = validateProducts(req.body);
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const index = Products.findIndex(p => p._id == id);
  if (index === -1) return res.status(404).send("Product not found.");

  Products[index] = { ...Products[index], ...req.body, _id: id };
  res.send(Products[index]);
});

app.delete("/api/beef/:id", (req, res) => {
  const { id } = req.params;
  const index = Products.findIndex(p => p._id == id);
  if (index === -1) return res.status(404).send("Product not found.");

  const deleted = Products.splice(index, 1);
  res.send(deleted[0]);
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
