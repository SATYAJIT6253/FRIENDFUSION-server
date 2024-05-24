const { sucess, error } = require('../utils/responseWraper');
const Post = require('../models/Post');
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
exports.getAllPostcontroller = async(req, res) => {

   return res.send(sucess(200, "this is all postrouter"));

}
// craetepost controllwer
exports.createpostcontroller = async (req, res) => {
   try {
      const { caption,postImg } = req.body;
      const owner = req._id;
      const user = await User.findById(req._id);
      if(!caption || !postImg)
      {
            return res.send(error(400,"please provide both post and caption carefully"));
      }
      const cloudImg = await cloudinary.uploader.upload(postImg,{
         folder :"postImage"
     })
      const post = await Post.create({
         caption, owner,
         image:{
            publicId:cloudImg.public_id,
            url:cloudImg.secure_url
         }
      })

      user.posts.push(post._id);
      await user.save();

      return res.send(sucess(200, post));

   } catch (e) {
      return res.send(error(500, e.message));
   }
}
// like and unlike post controller
exports.likeunlikeController = async (req, res) => {
   try {
      const { postId } = req.body;
      const currentuserid = req._id;

      const post = await Post.findById(postId);
      if (!post) {
         return res.send(error(404, "post not found"));

      }
      if (post.likes.includes(currentuserid)) {
         const index = post.likes.indexOf(currentuserid);
         post.likes.splice(index, 1);
      } else {
         post.likes.push(currentuserid);
      }
      await post.save();
      return res.send(sucess(200,{post}));
   } catch (e) {
      return res.send(error(500, e.message));
   }
}
// upadate post controller
exports.updatepostcontroller = async (req, res) => {
   try {
      const { postId, caption } = req.body;
      const currentuserid = req._id;

      const post = await Post.findById(postId);

      if (!post) {
         return res.send(error(404, "post not found"));
      }
      if (post.owner.toString() !== currentuserid) {
         return res.send(error(403, "only owners can upadte their post"));
      }

      if (caption) {
         post.caption = caption;
      }
      await post.save();
      return res.send(sucess(200, { post }));
   } catch (e) {
      return res.send(error(500, e.message));
   }

}

// deletpost controller
exports.deletpostcontroller = async (req,res) => {
   try {
      const { postId } = req.body;
      const currentserId = req._id;

      const post = await Post.findById(postId);
      const currentuser = await User.findById(currentserId);
      if (!post) {
          return res.send(error(404, "Post not found"));
      }

      if (post.owner.toString() !== currentserId) {
          return res.send(error(403, "Only owners can delete their posts"));
      }

      const index = currentuser.posts.indexOf(postId);
      currentuser.posts.splice(index, 1);
      await currentuser.save();
      await post.deleteOne();

      return res.send(sucess(200, "post deleted successfully"));
  } catch (e) {
      return res.send(error(500, e.message));
  }

}
