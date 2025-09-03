import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;
  // TODO: toggle subscription

  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "channel not found");
  }
  const subscriber = await User.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "subscriber not found");
  }
  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `${subscriber.username} unsubscribed ${channel.username} successfully`
        )
      );
  } else {
    await Subscription.create({
      subscriber: new mongoose.Types.ObjectId(subscriberId),
      channel: new mongoose.Types.ObjectId(channelId),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `${subscriber.username} subscribed ${channel.username} successfully`
        )
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
