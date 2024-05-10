const jwt = require("jsonwebtoken");
const {error} = require("../utils/responseWraper");
const User = require("../models/User");
require("dotenv").config();
module.exports = async (req,res,next)=>{
    if(!req.headers || 
       !req.headers.authorization || 
       !req.headers.authorization.startsWith("Bearer"))
       {
        return res.status(401).send("Authorization header is required");
       }
       const acesstoken = req.headers.authorization.split(" ")[1];
     //   console.log("acesstoken is" ,acesstoken);
       
       try {
            const decoded =  jwt.verify(acesstoken,process.env.TOKEN_PRIVATE_KEY)
                req._id = decoded._id;
                const user = await User.findById(req._id);
                if(!user){
                  return res.send(error(404,"user not found"));
                }
                next();
       } catch (e) {
           console.log(e.message);
          return res.send(error(401,"invaild acesskey"));
       }
       
};