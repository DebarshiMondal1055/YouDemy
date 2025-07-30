import { Router } from "express";
import { addVideoToWatchHistory, changeAccountDetails,
     changePassword, 
     getCurrentUser, 
     getUserChannelProfile, 
     getWatchHistory, 
     loginUser, 
     logoutUser, refreshAccessToken, 
     registerUser, updateUserAvatar, 
     updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verfifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()

router.route("/register").post(
    upload.fields([                     //middleware for file upload before registerUser is called
        {
            name: "avatar",
            maxCount:1
        },
        {   
            name:"coverimage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser); 


// secured routes

router.route("/logout").post(verfifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verfifyJWT,changePassword)

router.route("/change-account-details").patch(verfifyJWT,changeAccountDetails)

router.route("/get-user").get(verfifyJWT,getCurrentUser)

router.route("/update-avatar").patch(
    verfifyJWT,
    upload.single("avatar"),
    updateUserAvatar)

router.route("/update-cover-image").patch(
    verfifyJWT,
    upload.single("coverimage"),
    updateUserCoverImage
)

router.route("/c/:username").get(verfifyJWT,getUserChannelProfile);
router.route("/history").get(verfifyJWT,getWatchHistory)
router.route("/v/:videoId").post(verfifyJWT,addVideoToWatchHistory)
export default router;