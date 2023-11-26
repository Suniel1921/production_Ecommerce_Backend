const express = require ("express");
const router = express.Router();
const { requireLoggedIn, isAdmin } = require("../middleware/userAuthMiddleware");
const productController = require ("../controller/productController");
const formidable = require ("express-formidable");





router.post("/createProduct", requireLoggedIn, isAdmin, formidable(), productController.createProduct);
router.get("/allProduct", productController.allProduct);
router.get("/singleProduct/:id", productController.singleProduct);
router.get("/productPhoto/:id", productController.productPhoto);
router.put("/updateProduct/:id", requireLoggedIn, isAdmin, formidable(), productController.updateProduct);
router.delete("/deleteProduct/:id", requireLoggedIn, isAdmin, productController.deleteProduct);

//product filter
router.post("/productFilter", productController.productFilter);

//payment routes
//token
router.get('/braintree/token', productController.braintreeToken)
//payments
router.post('/braintree/payment', requireLoggedIn, productController.braintreePayment)



module.exports = router;