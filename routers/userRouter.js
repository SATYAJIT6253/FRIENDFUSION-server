const express = require("express");
const router = express.Router();


const postmiddleware = require("../middlewares/requireUser");
const {followUnfollowcontroler, getpostsoffollowing, getmyposts, getpostofuser, deletprofile, 
    getmyinformation,updaterofile,
    getuserProfile} = require("../controllers/userController");

router.post("/follow",postmiddleware,followUnfollowcontroler);
router.get("/getpostsoffollowing",postmiddleware,getpostsoffollowing);
router.get("/getmypost",postmiddleware,getmyposts);
router.get("/getpostofuser",postmiddleware,getpostofuser);
router.delete("/",postmiddleware,deletprofile);
router.get("/getmyinformation",postmiddleware,getmyinformation);
router.put("/updatemyprofile",postmiddleware,updaterofile);
router.post("/getuserprofile",postmiddleware,getuserProfile);
module.exports = router;
