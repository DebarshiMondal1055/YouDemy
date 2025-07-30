import { Router } from "express";
import { deleteLikedVideo, getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verfifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.use(verfifyJWT)
router.route("/toggle/v/:videoId").post(verfifyJWT,toggleVideoLike)
router.route("/toggle/c/:commentId").post(verfifyJWT,toggleCommentLike)
router.route("/toggle/t/:tweetId").post(verfifyJWT,toggleTweetLike)
router.route("/videos").get(verfifyJWT,getLikedVideos)
router.route("/delete/v/:videoId").post(verfifyJWT,deleteLikedVideo)

export default router;