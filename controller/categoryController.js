const categoryModel = require("../model/createCategory");
const slugify = require ('slugify');

//create category routes
exports.createCategory = async (req, res) => {
   try {
    const {name} = req.body;
    if(!name){
        return res.status(400).send({success : false, message : "Name is required"})
    }
    //checking category already exit or not
    const checkCategory = await categoryModel.findOne({name});
    if(checkCategory){
        return res.status(400).send({success: false, message : "Category Already Exit"});
    }
        const newCategory = categoryModel({name, slug:slugify(name)});
        await newCategory.save();
        res.status(201).send({success : true, message : "Category Created ",newCategory})
    
   } catch (error) {
    console.log(error)
    res.status(500).send({success : false , message : 'Error While Creating Category'})

    
   }
  };

  //get all category (read)
  exports.allCategory = async (req, res) =>{
    try {
        const allCategory = await categoryModel.find({});
        res.status(200).send({success : true, message : "All Category List",allCategory})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, message : "Error while getting all category"})
        
    }
  }

  //get single category (single read)
  exports.singleCategory = async (req, res)=>{
    try {
        const {id} = req.params;
        const singleCategory = await categoryModel.findById(id);
        res.status(200).send({success : true, message : "Single category list", singleCategory})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, message : "Error while getting single products",error})
        
    }
  }


  //update category (put/update method)
  exports.updateCategory = async (req, res)=>{
    try {
        const {id} = req.params;
        const {name} = req.body;
        const updateCategory = await categoryModel.findByIdAndUpdate(id,{name,slug: slugify(name)},{new: true});
        res.status(200).send({success: true, message : "Category Upated Successfully !", updateCategory})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false, message : "Error while updating category"})
        
    }
  }


  //delete category (delete method)
  exports.deleteCategory = async (req, res)=>{
    try {
        const {id} = req.params;
         const deleteCategory = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({success: true, message : "Category Deleted"})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false , message : "Error while deleting Category"})
        
    }
  }