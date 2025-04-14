const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

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

app.get("/api/beef", (req, res)=>{
  res.send(Products);
});

app.get("/api/pork", (req, res)=>{
  res.send(Pork);
});

app.post("/api/beef", upload.single("img"), (req,res)=>{
  const result = validateProducts(req.body);


  if(result.error){
      console.log("I have an error");
      res.status(400).send(result.error.deatils[0].message);
      return;
  }

  const product = {
      _id: Products.length,
      name:req.body.name,
      cutDescription:req.body.cutDescription,
      averageWeight:req.body.averageWeight,
      pricePerPound:req.body.pricePerPound,
  };

  //adding image
  if(req.file){
      product.image = req.file.filename;
  }

  products.push(product);
  res.status(200).send(product);
});

app.post("/api/prok", upload.single("img"), (req,res)=>{
  const result = validatePork(req.body);


  if(result.error){
      console.log("I have an error");
      res.status(400).send(result.error.deatils[0].message);
      return;
  }

  const pork = {
      _id: Pork.length,
      name:req.body.name,
      cutDescription:req.body.cutDescription,
      averageWeight:req.body.averageWeight,
      pricePerPound:req.body.pricePerPound,
  };

  //adding image
  if(req.file){
      pork.image = req.file.filename;
  }

  pork.push(pork);
  res.status(200).send(pork);
});





const validateProducts = (product) => {
  const schema = Joi.object({
      _id:Joi.allow(""),
      name:Joi.string().min(3).required(),
      cutDescription:Joi.number().required().min(0),
      averageWeight:Joi.number().required().min(0),
      pricePerPound:Joi.number().required().min(0),

  });

  return schema.validate(product);
};

const validatePork = (pork) => {
  const schema = Joi.object({
      _id:Joi.allow(""),
      name:Joi.string().min(3).required(),
      cutDescription:Joi.number().required().min(0),
      averageWeight:Joi.number().required().min(0),
      pricePerPound:Joi.number().required().min(0),

  });

  return schema.validate(pork);
};

app.listen(3001, ()=>{
  console.log("I'm listening");
});
