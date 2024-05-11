const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {error,sucess} = require("../utils/responseWraper");
// signup controller this controller is used for signup puprpose
exports.signupController = async(req,res)=>{
    try {
        const{email,password,name} = req.body;
        if(!email || !password || !name)
        {
            return res.send(error(400,"please provide all data carefully"));
        }
        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.send(error(400,"user is already registred"));
           
        }
        const hashpassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashpassword,
        })
        // const newuser = await User.findOne(user._id);
        
        return res.send(sucess(201,'user created sucessfully'));
    } catch (error) {
        // console.log(error);
        
        return res.send(error(500,error.message));
    }
}
// login controller this controller is used for 
exports.loginController = async(req,res)=>{
    try {
        const{email,password} = req.body;
        if(!email || !password)
        {
            return res.send(error(400,"please provide all data carefully"));
        }
        const oldUser = await User.findOne({email}).select('+password');
        if(!oldUser){
            return res.send(error(404,"please register first"));
        }

        const matched = await bcrypt.compare(password,oldUser.password);
        if(!matched){
            return res.send(error(405,"incorrect password"));
        }
        const acesstoken = generateacesstoken({
            _id:oldUser.id,
            email:oldUser.email,
        });
        const refershtoken = generatrefershtoken({
            _id:oldUser.id,
            email:oldUser.email,
        });
        res.cookie("jwt",refershtoken,{
            httpOnly:true,
            secure:true,
        })
        
        return res.send(sucess(200, { acesstoken }));
    } catch (e) {
        console.log(e);
        console.error(e);
        return res.send(error(500,e.message));
        
    }
}
// refershtoken controller
require("dotenv").config();
exports.refreshacesstakencontroller = async(req,res)=>{
    const cookies = req.cookies;
    if(!cookies.jwt){
        return res.send(error(401,"refersh token in cookies is required"));
    }
    const refershtoken = cookies.jwt;
    
    try {
        const decoded = jwt.verify(refershtoken,process.env.REFERSH_PRIVATE_KEY)
            const _id = decoded._id;
            const acesstoken = generateacesstoken({_id});
            return res.send(sucess(201,({acesstoken})));
     
   } catch (error) {
        console.log(error.message);
        return res.send(error(401,"invaild refershtoken"));
   }
}
require("dotenv").config();
const generateacesstoken = (data)=>{
    try {
        const token =  jwt.sign(data,process.env.TOKEN_PRIVATE_KEY,{expiresIn:"15m"});
        return token;
    } catch (error) {
        console.log(error);
    }
}

const generatrefershtoken = (data)=>{
    try {
        const token = jwt.sign(data,process.env.REFERSH_PRIVATE_KEY,{expiresIn:"15m"});
        return token;
    } catch (error) {
        console.log(error);
    }
}
// logout controller
exports.logoutcontroller = async(req,res)=>{
    try {
        res.clearCookie('jwt',{
            httpOnly:true,
            secure:true,
        })
        return res.send(sucess(200,"logout sucessfully"));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}