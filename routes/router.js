const express = require ("express");
const router = express.Router();
const userController = require ('../controller/userController');
const {requireLoggedIn, isAdmin } = require("../middleware/userAuthMiddleware");


router.post("/register",userController.register);
router.post("/login", userController.login);

//users private routes
router.get("/userAuth", requireLoggedIn, (req, res)=>{
    res.status(200).send({ok: true})
})
//admin private routes
router.get("/adminAuth", requireLoggedIn, isAdmin, (req, res)=>{
    res.status(200).send({ok: true})
})


//get user orders
router.get('/getUserOrder', requireLoggedIn, userController.getUserOrder)
//all orders admin (manged all orders by admin)
router.get('/allOrders', requireLoggedIn, userController.allOrders)
//order status update 
router.put('/upateOrderStatus/:id', requireLoggedIn, isAdmin, userController.updateOrderStatus)




module.exports = router;