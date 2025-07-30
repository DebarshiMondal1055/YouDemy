import { Router } from "express";
import { verfifyJWT } from "../middlewares/auth.middleware.js";
import { addVideosToPlayList, createPlayList, 
    deletePlayList, 
    deleteVideoFromPlaylist, 
    getPlaylistById, 
    getUserPlaylist, 
    removeVideoFromPlaylist, 
    updatePlayList} from "../controllers/playlist.controller.js";

const router=Router()

router.use(verfifyJWT)

router.route("/create-playlist").post(verfifyJWT,createPlayList)       //done
router.route("/p/users/:userId").get(verfifyJWT,getUserPlaylist)       //done
router.route("/:playListId/videos").post(verfifyJWT,addVideosToPlayList)   //done
router.route("/p/:playlistId/v/:videoId").post(verfifyJWT,removeVideoFromPlaylist)
router.route("/p/:playListId").post(verfifyJWT,deletePlayList)
router.route("/:playListId").patch(verfifyJWT,updatePlayList)      //done
router.route("/get-playlist").get(verfifyJWT,getPlaylistById)
router.route("/v/:videoId").post(verfifyJWT,deleteVideoFromPlaylist)

export default router;