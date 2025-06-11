import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { 
    commentOnPost, getFollowingPosts, getUserPosts,saveUnsavePost,getSavedPosts,
    deleteComment,getLikedPosts , createPost, deletePost, likeUnlikePost,getAllPosts 
} from '../controllers/post.controller.js';

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.get('/followingposts', protectRoute, getFollowingPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.get('/saves/:id', protectRoute, getSavedPosts);
router.post('/create',protectRoute,createPost);
router.post('/like/:id',protectRoute, likeUnlikePost);
router.post('/save/:id',protectRoute, saveUnsavePost);
router.post('/comment/:id',protectRoute, commentOnPost);
router.delete('/:id',protectRoute,deletePost);
router.delete('/:id/comments/:commentId', protectRoute, deleteComment);



export default router;