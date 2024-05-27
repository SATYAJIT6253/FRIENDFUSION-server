var ta = require('time-ago');
const mapPostOtput = (post,userId)=>{
    return {
        _id:post._id,
        caption:post.caption,
        image:post.image,
        owner:{
            _id:post.owner._id,
            name : post.owner.name,
            avatar:post.owner.avatar
        },
        likescnt : post.likes.length,
        isliked : post.likes.includes(userId),
        timeago : ta.ago(post.createdAt)
    }
}
module.exports = {
    mapPostOtput
}