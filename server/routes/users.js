import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateInfo,
  getall,
  deleteNotifications,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getall);
router.get("/:id", verifyToken, getUser);
// router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id",verifyToken,updateInfo);
router.patch("/:id/notification",deleteNotifications);

export default router;