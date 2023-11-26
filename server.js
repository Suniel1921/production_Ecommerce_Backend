const express = require("express");
const app = express();
//dotenv setup
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 2000;
//import section
const db = require("./config/dbConn");
const router = require("./routes/router");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoute");
const cors = require("cors");
// const formidable = require("express-formidable");
const stripe = require("stripe");

//stripe configuration
const stripeGateway = new stripe(process.env.STRIPE_SECRET_KEY);

//middleware
app.use(cors());
app.use(express.json());

//this is bad practice for deploying like this (just for testing purpose)
// Serve static files from the "dist" directory
app.use(express.static("dist"));
// app.use(express.static(path.join(__dirname, 'dist')));

//router middleware
app.use("", router);
app.use("", categoryRoutes);
app.use("", productRoutes);
// app.use(formidable());

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port no : ${PORT}`);
});
