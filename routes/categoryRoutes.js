const express = require ("express");
const router = express.Router();
const categoryController = require ("../controller/categoryController");
const { requireLoggedIn, isAdmin } = require("../middleware/userAuthMiddleware");


router.post("/createCategory", requireLoggedIn, isAdmin, categoryController.createCategory);
router.get("/allCategory", categoryController.allCategory);
router.get("/singleCategory/:id", categoryController.singleCategory);
router.put("/updateCategory/:id", requireLoggedIn, isAdmin, categoryController.updateCategory);
router.delete("/deleteCategory/:id",requireLoggedIn, isAdmin, categoryController.deleteCategory);





module.exports = router;