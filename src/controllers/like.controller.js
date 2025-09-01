import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"

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
        await Like.create({ video: new mongoose.Types.ObjectId(videoId), likedBy: new mongoose.Types.ObjectId(userId) });
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
        await Like.create({ comment: new mongoose.Types.ObjectId(commentId), likedBy: new mongoose.Types.ObjectId(userId) });
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
        await Like.create({ tweet: new mongoose.Types.ObjectId(tweetId), likedBy: (userId) });
        return res
        .status(200)
        .json(new ApiResponse(200, tweet, "tweet liked successfully"));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id

    const likedVideos = await Like.find({
        likedBy: userId,
        video: {
            $exists: true,
            $ne: null
        }
    })
    .populate("video");
    
    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}