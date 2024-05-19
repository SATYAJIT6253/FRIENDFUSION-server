// create instance of express
const express = require("express");
const app = express();
// import morgan to print in console the current api
const morgan = require("morgan");
const cors = require("cors");

// import the dotenv to acesss from .env file through process object
const cookieparser = require("cookie-parser");
require("dotenv").config();

// import the cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
// use of middleeares
app.use(express.json());
app.use(morgan("common"));
app.use(cookieparser());
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000',
    origin:'https://frienfusion-cilent.onrender.com'

}))

app.use("/auth",authRouter);
app.use("/posts",postRouter);
app.use("/user",userRouter);
const PORT = process.env.PORT;
app.get("/",(req,res)=>{
    res.status(401).send("chal raha hi bahi");
})
const dbConnect = require("./dbConnect");

dbConnect();
app.listen(PORT,()=>{
    console.log(`app listen on : ${PORT}`);
})