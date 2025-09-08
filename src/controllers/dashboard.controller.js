import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const channelId = req.user?._id;

    if (!channelId) {
        throw new ApiError(404, "unauthorized access");
    }

    // get total videos
    const totalVideos = await Video.countDocuments({owner: new mongoose.Types.ObjectId(channelId)});

    // get total views
    const viewsAggregate = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ]);

    const totalViews = viewsAggregate.length > 0 ? viewsAggregate[0].totalViews : 0;

    // get total subscribers 

    const totalSubscribers = await Subscription.countDocuments({channel: new mongoose.Types.ObjectId(channelId)});

    // get total likes across all videos

    const likeAgg = await Like.aggregate([
        {
            $match: {
                video: {
                    $exists: true
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        {
            $unwind: 
                "$videoData"
        },
        {
            $match: {
                "videoData.owner": new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: 1
                }
            }
        }
    ]);
    const totalLikes = likeAgg.length > 0 ? likeAgg[0].totalLikes : 0;

    return res
    .status(200)
    .json(new ApiResponse(200, {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    }, "channel stats fetched successfully"));

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const channelId = req.user?._id;

    if (!channelId) {
        throw new ApiError(404, "channel id is required");
    }

    // Extract Pagination params
    const { page = 1, limit = 10 } = req.query;

    // use aggregation for pagination
    const aggregateQuery = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const videos = await Video.aggregatePaginate(aggregateQuery, options);

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "channel videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }