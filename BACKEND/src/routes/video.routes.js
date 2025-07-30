import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verfifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, 
    getAllVideos, 
    getHomePageVideos, 
    getUserVideos, getVideoById, updateVideo, uploadVideo } from "../controllers/video.controller.js";

const router=Router()

router.route("/uploadVideo").post(
    verfifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),uploadVideo)

router.route("/v/:videoId").get(verfifyJWT,getVideoById);
router.route("/v/:videoId").patch(verfifyJWT,updateVideo);
router.route("/v/:videoId").post(verfifyJWT,deleteVideo);
router.route("/get-all-videos").get(verfifyJWT,getAllVideos);
router.route("/:userId").get(getUserVideos)
router.route("").get(verfifyJWT,getHomePageVideos)

export default router;