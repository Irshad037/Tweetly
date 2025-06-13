import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
    followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser, getFollowingUsers,
    getFollowerUsers,removeUser

} from '../controllers/user.controller.js';
const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/profile/:username/following", protectRoute, getFollowingUsers);
router.get("/profile/:username/follower", protectRoute, getFollowerUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/removefollower/:id", protectRoute, removeUser);
router.post("/update", protectRoute, updateUser);


export default router