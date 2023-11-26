
const userModel = require("../model/userModel");
const userHelper = require("../helper/userHelper");
const JWT = require("jsonwebtoken");
const orderModel = require("../model/orderModel");

// User registration route
exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).send({ success: false, message: "All Fields are required" });
      }
  
      const userExists = await userModel.findOne({ email });
      if (userExists) {
        return res.status(400).send({ success: false, message: "Email Already Exists" });
      }
  
      const hashedPassword = await userHelper.hashPassword(password);
      const newUser = new userModel({ name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).send({ success: true, message: "User Registered Successfully", newUser });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "User registration failed" });
    }
  };
  
// User login route
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    const userExit = await userModel.findOne({ email });
    if (!userExit) {
      return res.status(400).send({ success: false, message: "Email Not Exist" });
    }

    const passwordMatch = await userHelper.comparePassword(password, userExit.password);
    if (!passwordMatch) {
      return res.status(400).send({ success: false, message: "Invalid Email or Password" });
    }

    const token = JWT.sign({_id: userExit._id }, process.env.SECRATE_TOKEN_KEY, {
      expiresIn: "5d",
    });

    res.status(200).send({ success: true, message: "Logged In Successfully!", userExit, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: `Login failed ${error}`});
  }
};

// Test route
exports.test = (req, res) => {
  res.send("I am a protected route");
};

// Admin route
exports.admin = (req, res) => {
  res.send("I am an admin dashboard");
};



//user orders
exports.getUserOrder = async (req ,res)=>{
  try {
    const orders = await orderModel.find({buyer: req.userExit._id}).populate('products','-photo').populate('buyer','name')
    res.json(orders)
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success: false, message: 'Error while getting user oders'})
    
  }
}

//mange by all order by admin (get all orders)
exports.allOrders = async (req, res)=>{
  try {
    const allOrders = await orderModel.find({}).populate('products','-photo')
    .populate('buyer','name').sort({createAt: '-1'})
    res.json(allOrders)
    
  } catch (error) {
    console.log(error)
    
  }
}

//update order status
exports.updateOrderStatus = async (req ,res)=>{
  try {
    const {id} = req.params;
    const {status} = req.body;
    const orderStatusUpdate = await orderModel.findByIdAndUpdate(id,{status}, {new:true})
    res.json(orderStatusUpdate)
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success: false, message: 'Error while updating order status'})
    
  }
}





