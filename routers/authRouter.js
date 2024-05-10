const express = require("express");
const router = express.Router();

const{signupController,loginController,refreshacesstakencontroller,logoutcontroller} = require("../controllers/authControllers");
router.post("/signup",signupController);
router.post("/login",loginController);
router.post("/logout",logoutcontroller);
router.get("/refersh",refreshacesstakencontroller);

module.exports= router;
