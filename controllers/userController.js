const {sucess,error} = require('../utils/responseWraper');
const User = require("../models/User");
const Post = require("../models/Post");
const { populate } = require('dotenv');
const { mapPostOtput } = require('../utils/mapPost');
const cloudinary = require('cloudinary').v2;

exports.followUnfollowcontroler = async(req,res)=>
{
    try {
        const {useridtofollow} = req.body;
        const currentuserid = req._id;

        const usertofollow = await User.findById(useridtofollow);
        const currentuser = await User.findById(currentuserid);
        if(!usertofollow){
            return res.send(error(404,"user to follow not found"));
        }
        if(currentuserid === useridtofollow)
        {
            return res.send(error(409,"you cannot follw yourself"));
        }
        if(currentuser.followings.includes(useridtofollow)){
            const followingindex = currentuser.followings.indexOf(useridtofollow);
            currentuser.followings.splice(followingindex,1);

            const followerindex = usertofollow.followers.indexOf(currentuser);
            usertofollow.followers.splice(followerindex,1);
            
            await usertofollow.save();
            await currentuser.save();

            return res.send(sucess(200,"user unfollowed"));
        }else{
            currentuser.followings.push(useridtofollow);
            usertofollow.followers.push(currentuserid);

            await usertofollow.save();
            await currentuser.save();

            return res.send(sucess(200,"user followed"));

        }
    } catch (e) {
        console.log(e);
        return res.send(error(500,e.message));
    }
}

exports.getpostsoffollowing = async (req,res)=>
{
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId).populate("followings");

        const fullPosts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        }).populate('owner');

        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();
        
        const followingsIds = curUser.followings.map((item) => item._id);
        followingsIds.push(req._id);

        const suggestions = await User.find({
            _id: {
                $nin: followingsIds,
            },
        });

        return res.send(sucess(200, {...curUser._doc, suggestions, posts}));
    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    }
}
// getpost of own
exports.getmyposts = async (req,res)=>
{
    try {
        const currentuserid = req._id;
        const myallposts = await Post.find({
            owner: currentuserid
        });
        return res.send(sucess(200,{myallposts}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}
// getpost of a use
exports.getpostofuser = async (req,res)=>
{
    try {
        const userid = req.body.userid;
        if(! userid){
            return res.send(error(400,"userid is required"));
        }
        const alluserposts = await Post.find({
            owner: userid
        });
        
        return res.send(sucess(200,{alluserposts}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}
// delet profile
exports.deletprofile = async(req,res)=>{
    try {
        const curuserid = req._id;
        const curuser = await User.findById(curuserid);

        // delete all posts
        await Post.deleteMany({
            owner: curuserid,
        });

        // removed myself from followers' followings
        curuser.followers.forEach(async (followerid) => {
            const follower = await User.findById(followerid);
            const index = follower.followings.indexOf(curuserid);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        // remove myself from my followings' followers
        curuser.followings.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curuserid);
            following.followers.splice(index, 1);
            await following.save();
        });

        // remove myself from all likes
        const allPosts = await Post.find();
        allPosts.forEach(async (post) => {
            const index = post.likes.indexOf(curuserid);
            post.likes.splice(index, 1);
            await post.save();
        });

        // delete user
        await curuser.deleteOne();

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
        });

        return res.send(sucess(200, "user deleted sucessfully"));
    } catch (e) {
        
        return res.send(error(500, e.message));
    }
};
exports.getmyinformation = async(req,res)=>{
        try {
            const user = await User.findById(req._id);
            return res.send(sucess(200,{user}));
        } catch (e) {
            return res.send(error(500, e.message));
        }
}


exports.updaterofile = async(req,res)=>{
    try {
        const {name,bio,Userimg} = req.body;
        const user = await User.findById(req._id);

        if(name)
        {
            user.name = name;
        }
        if(bio)
        {
            user.bio = bio;
        }
        if(Userimg)
        {
            const cloudImg = await cloudinary.uploader.upload(Userimg,{
                folder :"Profile Image"
            })
            user.avatar = {
                url : cloudImg.secure_url,
                publicId : cloudImg.public_id
            }
        }

        await user.save();

        return res.send(sucess(200,{user}));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

exports.getuserProfile = async(req,res)=>{
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path:'posts',
            populate:{
                path:'owner'
            }
        })
        const fullposts = user.posts;
        const posts = fullposts.map(item => mapPostOtput(item,req._id)).reverse();
        // user.-docs just give us the relvant things tha are required
        return res.send(sucess(200,{...user._doc,posts}));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}
