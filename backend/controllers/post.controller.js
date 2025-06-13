import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from '../models/notification.modal.js'
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
    try {
        let { text, img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });
        }

        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        console.error("Error in createPost:", error?.message || error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" })
        }

        if (post.img) {
            const imagId = post.img.split('/').pop().split(".")[0];
            await cloudinary.uploader.destroy(imagId)
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = post.comments.find(
            (comment) => comment._id.toString() === commentId
        );

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this comment" });
        }

        post.comments = post.comments.filter(
            (comment) => comment._id.toString() !== commentId
        );

        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error in deleteComment controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;

        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = { user: userId, text };
        post.comments.push(comment);

        await post.save();

        res.status(200).json(post)
    } catch (error) {
        console.error("Error in commentOnPost controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { id: postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikePost = post.likes.includes(userId);

        if (userLikePost) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
            await post.save();
            await User.updateOne({_id:userId}, {$pull:{likedPosts:postId}})
            
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            post.likes.push(userId);
            await post.save()
            await User.updateOne({_id:userId}, {$push:{likedPosts:postId}})



            const notification = new Notification({
                from: userId,
                to:post.user,
                type:"like"
            });
            await notification.save();

            res.status(200).json({message: "Post liked successfully"})
        }
    } catch (error) {
        console.error("Error in likeUnlikePost controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const saveUnsavePost = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { id: postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userSavePost = post.saves.includes(userId);

        if (userSavePost) {
            post.saves = post.saves.filter(id => id.toString() !== userId);
            await post.save();
            await User.updateOne({_id:userId}, {$pull:{savedPosts:postId}})
            
            return res.status(200).json({ message: "Post unsaved successfully" });
        } else {
            post.saves.push(userId);
            await post.save()
            await User.updateOne({_id:userId}, {$push:{savedPosts:postId}})

            res.status(200).json({message: "Post saved successfully"})
        }
    } catch (error) {
        console.error("Error in saveUnsavePost controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllPosts = async (req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt: -1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });
        
        if(posts.length === 0){
            return res.status(200).json([])
        }
        
        res.status(200).json(posts)
    } catch (error) {
        console.error("Error in getAllPosts controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    
    }
}

export const getLikedPosts = async (req,res)=>{
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user)return res.status(404).json({error:"User not found"})

        const likedPosts = await Post.find({_id:{$in: user.likedPosts}})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });
        
        res.status(200).json(likedPosts)
    } catch (error) {
        console.error("Error in getLikedPosts controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    
    }
}
export const getSavedPosts = async (req,res)=>{
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user)return res.status(404).json({error:"User not found"})

        const savedPosts = await Post.find({_id:{$in: user.savedPosts}})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });
        
        res.status(200).json(savedPosts)
    } catch (error) {
        console.error("Error in getLikedPosts controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    
    }
}

export const getFollowingPosts =  async (req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        const following = user.following;

        const feedPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1})
        .populate({
            path : "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(feedPosts)

    } catch (error) {
        console.error("Error in getFollowingPosts controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserPosts = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find posts made by the user
        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password", // Exclude password field
            })
            .populate({
                path: "comments.user",
                select: "-password", // Exclude password field from comment users
            });

        // Send posts as response
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getUserPosts controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
