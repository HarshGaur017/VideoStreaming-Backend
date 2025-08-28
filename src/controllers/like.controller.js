import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id
    //TODO: toggle like on video
    // check if video exists

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "video not found");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId});

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(new ApiResponse(200, "video unliked successfully"));
    } else {
        await Like.create({ video: videoId, likedBy: userId });
        return res
        .status(200)
        .json(new ApiResponse(200, "video liked successfully"));
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    //TODO: toggle like on comment

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId});

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(new ApiResponse(200, comment, "comment unliked successfully"));
    } else {
        await Like.create({ comment: commentId, likedBy: userId });
        return res
        .status(200)
        .json(new ApiResponse(200, comment, "comment liked successfully"));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId});

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(new ApiResponse(200, tweet, "tweet unliked successfully"));
    } else {
        await Like.create({ tweet: tweetId, likedBy: userId });
        return res
        .status(200)
        .json(new ApiResponse(200, tweet, "tweet liked successfully"));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}