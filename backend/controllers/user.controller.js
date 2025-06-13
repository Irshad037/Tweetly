import Notification from "../models/notification.modal.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary';

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserProfile:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id },
            });
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },
            });

            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id },
            });
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            });

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save();
            return res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error("Error in followUnfollowUser:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't remove yourself" });
        }

        
        
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        
        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollower= currentUser.followers.includes(id);

        if (isFollower) {
            // remove
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { followers: id },
            });
            await User.findByIdAndUpdate(id, {
                $pull: { following: req.user._id },
            });
        } 
        return res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Error in followUnfollowUser:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            }, {
                $sample: { size: 10 }
            }
        ])

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach(user => user.password = null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error("Error in suggestedUsers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getFollowingUsers = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select("following")
            .populate("following", "username fullName profileImg")
            .lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.following);
    } catch (error) {
        console.error("Error in getFollowingUsers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getFollowerUsers = async (req, res) => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username })
        .select("followers")
        .populate("followers","username fullName profileImg")
        .lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.followers);
    } catch (error) {
        console.error("Error in getFollowerUsers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUser= async (req, res) => {
    const {fullName, email, username,currentPassword, newPassword, bio, link}= req.body;
    let{profileImg , coverImg} = req.body;
    let userId = req.user._id;

    try {

        let user = await User.findById(userId);
        if(!user)return res.status(404).json({message:"user not found"});

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({error: "Please provide both current password and new password"})
        }
        
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if(!isMatch){
                return res.status(400).json({error: " Current password is incorrect"})
            }
            if (newPassword.length < 6) {
                return res.status(400).json({error: " Password must be atleast 6 character"})
            }

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(newPassword , salt)
        }
        
        if(profileImg){

            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadReasponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadReasponse.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadReasponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadReasponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;
        return res.status(200).json(user)

    } catch (error) {
        console.error("Error in suggestedUsers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}    