import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const owner = req.user?._id

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const tweet = await Tweet.create({content, owner});

  if (!tweet) {
    throw new ApiError(500, "something went wrong while creating tweet");
  }

  return res
  .status(201)
  .json(new ApiResponse(201, tweet, "tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user?._id

  const userTweets = await Tweet.find({owner: userId});

  if (!userTweets || userTweets.length === 0) {
    throw new ApiError(404, "user tweets not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, userTweets, "user tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(400, "tweet id is required");
  }

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
        $set: {
            content,
        },
    },
    { new: true }
  );

  return res
  .status(200)
  .json(new ApiResponse(200, updatedTweet, "tweet updated successfully"));

});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "tweet id is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  return res
  .status(200)
  .json(new ApiResponse(200, deletedTweet, "tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
