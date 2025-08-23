import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

})

const publishAVideo = asyncHandler(async (req, res) => {

    // Procedure
    // 1. get video, thumbnail from req.files
    // 2. get video title and description from req.body
    // 3. upload video and thumbnail to cloudinary
    // 4. take duration from cloudinary object and owner by auth middleware req.user._id
    // 4. create video in db
    // 5. send response

    const { title, description} = req.body
    console.log("title from body", title);
    console.log("descripton from body", description);

    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "title and description is required");
        
    }
    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    console.log("videoLOcalPath", videoLocalPath);
    console.log("thumbnailLOcalPath", thumbnailLocalPath);

    if (!videoLocalPath) {
        throw new ApiError(400, "video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail file is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log("cloudinary video url", videoFile);
    console.log("cloudinary thumbnail url", thumbnail);

    if (!videoFile) {
        throw new ApiError(500, "something went wrong while uploading video");
    }

    if (!thumbnail) {
        throw new ApiError(500, "something went wrong while uploading thumbnail");
    }

    const duration = videoFile?.duration;
    console.log("duration", duration);

    const owner = req.user?._id;
    console.log("owner", owner);

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: duration,
        owner: owner
    })

    console.log("final video", video);

    if (!video) {
        throw new ApiError(500, "something went wrong while creating video");
    }

    return res
    .status(201)
    .json(new ApiResponse(201, video, "video created successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}