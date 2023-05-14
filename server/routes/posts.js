import express from "express";
import { commentPost, createPost, deletePost, getFeedPosts, getPost, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:Id/post", getPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment",verifyToken,commentPost);
router.patch("/:id/delete",verifyToken,deletePost);

/* create*/
router.post("/",verifyToken, createPost);
export default router;