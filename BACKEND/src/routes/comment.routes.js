import { Router } from "express";
import { verfifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments } from "../controllers/comment.controller.js";

const router=Router()

router.route("/:videoId").post(verfifyJWT,addComment)
router.route("/ct/:commentId").post(verfifyJWT,deleteComment)
router.route("/v/:videoId").get(getVideoComments)


export default router;