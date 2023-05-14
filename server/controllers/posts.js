import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description} = req.body;
    let picturePath="";
    if(req.body.picturePath){
      picturePath=req.file.path;
    }
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      likes: [],
      comments: [],
    });
    const post=await newPost.save();

    //const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getPost = async (req, res) => {
  try {
    const { Id } = req.params;
    const post = await Post.findById(Id);
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


/* UPDATE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    const posts=await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const userid=post.userId;
    const user=await User.findById(userid);
    const likeuser=await User.findById(userId);
    const isLiked = post.likes.findIndex(obj => obj.userId === userId);
    const likeusername=likeuser.firstName+" "+likeuser.lastName;
    if (isLiked!=-1) {
      post.likes.splice(isLiked, 1);
      const msg=`${likeusername} unliked in your post`
      user.notification.push(
        {
          msg,id
        }
      )
    } else {
      post.likes.push({userId,likeusername});
      const msg=`${likeusername} liked in your post`
      user.notification.push(
        {
          msg,id
        }
      )
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    if(userid!=userId){
    const notification = await User.findByIdAndUpdate(
      userid,
      { notification : user.notification },
      { new: true }
    );
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId,commentusername, comment } = req.body;
    const post = await Post.findById(id);
    const userid=post.userId;
    const user=await User.findById(userid);
    const msg=`${commentusername} commented in your post`
    user.notification.push(
      {
        msg,id
      }
    )
    post.comments.push({userId,commentusername,comment});
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );
    if(userid!=userId){
    const notification = await User.findByIdAndUpdate(
      userid,
      { notification: user.notification },
      { new: true }
    );
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};