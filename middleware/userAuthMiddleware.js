const JWT= require ('jsonwebtoken');
const userModel = require('../model/userModel');
//Token Based Protected Routes
exports.requireLoggedIn = async (req, res, next)=>{
    try {
        const loggedInUser = JWT.verify(req.headers.authorization, process.env.SECRATE_TOKEN_KEY);
        req.userExit = loggedInUser; 
        next();       
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, message : "Login First "})
        
    }
}


//admin protected routes

exports.isAdmin = async (req, res,next)=>{
    try {
        const user = await userModel.findById(req.userExit._id);
        if(user.role !== 1){
            return res.status(401).send({success : false, message : "Unauthorized Access"})
        }
        else{
            next();
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, message : "Error while Accessing Admin Routes"})
        
    }

}




