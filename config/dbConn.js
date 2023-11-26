const mongoose = require ('mongoose');
mongoose.connect(process.env.DB_CONN)
.then(()=>{
    console.log(`Database Connected !`)
})
.catch((error)=>{
    console.log(`Database Not Connected`,error)
})