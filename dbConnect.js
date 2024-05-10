const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = ()=>{
    mongoose.connect(process.env.MONGOURI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(()=>console.log("connectionn sucessfull re baba"))
    .catch((error)=>{
        console.log("connection failed");
        console.log(error);
        console.log(error.message);
        process.exit(1);
    });
}
module.exports = dbConnect;
    