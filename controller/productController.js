const fs = require("fs"); //for image
const productModel = require("../model/productMode");
const slugify = require("slugify");
const braintree = require ("braintree")
const orderModel = require ("../model/orderModel");
// const orderModel = require ("../model/createCategory");

const dotenv = require ('dotenv');
dotenv.config();

//payment gateway
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});






// //create product and photo uploading

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, quantity, price } = req.fields;
    const { photo } = req.files;

    if (!photo || photo.size > 1000000) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Photo is required and must be less than 2MB ",
        });
    }

    if (!name || !description || !category || !quantity || !price) {
      return res
        .status(400)
        .send({ success: false, message: "All Fields are required " });
    }

    //***************or***************
    // switch(true){
    //     case !name :
    //          return  res.status(500).send({error : 'Name is required '})
    //     case !description :
    //          return  res.status(500).send({error : 'description is required '})
    //     case !category :
    //          return  res.status(500).send({error : 'category is required '})
    //     case !quantity :
    //          return  res.status(500).send({error : 'quantity is required '})
    //     case !price :
    //          return  res.status(500).send({error : 'price is required '})
    //     case photo && photo.size > 1000000 :
    //          return  res.status(500).send({error : 'photo is required & must be less than 1MB '})
    // }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res
      .status(201)
      .send({
        success: true,
        message: "Product created Successfully",
        products,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while creating products" });
  }
};

//get all products (read method)
exports.allProduct = async (req, res) => {
  try {
    const allProduct = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .send({
        success: true,
        message: "All Products Lists",
        total: allProduct.length,
        allProduct,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while getting all products" });
  }
};

//get single products
exports.singleProduct = async (req, res) => {
  try {
    // const {slug} = req.params;
    // const singleProduct = await productModel.findById(slug).populate('category').select('-photo');
    const { id } = req.params;
    const singleProduct = await productModel
      .findById(id)
      .populate("category")
      .select("-photo");
    res
      .status(200)
      .send({ success: true, message: "Single Product", singleProduct });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while getting single product" });
  }
};

//get product photo

exports.productPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const productPhoto = await productModel.findById(id).select("photo");
    if (productPhoto.photo.data) {
      res.set("Content-type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while getting product photo" });
  }
};

// upate product route
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, quantity, price } = req.fields;
    const { photo } = req.files;
    const { id } = req.params;

    if (!photo || photo.size > 1000000) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Photo is required and must be less than 2MB ",
        });
    }

    if (!name || !description || !category || !quantity || !price) {
      return res
        .status(400)
        .send({ success: false, message: "All Fields are required " });
    }

    const products = await productModel.findByIdAndUpdate(
      id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res
      .status(201)
      .send({
        success: true,
        message: "Product updated Successfully",
        products,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Error updating products ${error}` });
  }
};

//delete product (delete method)

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await productModel.findByIdAndDelete(id);
    res
      .status(200)
      .send({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while deleting product" });
  }
};

//product filters
exports.productFilter = async (req, res) => {
  try {
    const {checked, radio} = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error while filtering products ${error}`,
      });
  }
};


//payment gatewat api token
exports.braintreeToken = async (req, res)=>{
  try {
    gateway.clientToken.generate({}, function(err, response){
      if(err){
        res.status(500).send(err)
      }
      else{
        res.send(response)
      }
    })
    
  } catch (error) {
    console.log(error)
  }
}


//payments
exports.braintreePayment = async(req ,res)=>{
  try {
    const {cart, nonce} = req.body;
    let total = 0;
    cart.map((i)=>{
      total += i.price;
    })

    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce, // Corrected field name
      options: {
        submitForSettlement: true,
      },
    },
    function (error, result){
      if(result){
        const order = new orderModel({
          products: cart,
          payment : result,
          buyer : req.userExit._id,
        }).save();
        res.json({ok: true})
      }
      else{
        res.status(500).send(error)
      }
    }

    )
    
  } catch (error) {
    console.log(error)    
  }
}