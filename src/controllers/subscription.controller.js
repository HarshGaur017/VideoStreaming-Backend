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

  // validate channel
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "channel not found");
  }

  // fetch subscribers
  const subscriptions = await Subscription.find({channel: channelId})
  .populate("subscriber", "username avatar email");

  return res
    .status(200)
    .json(new ApiResponse(200, {
      channel: channel.username,
      totalSubscribers: subscriptions.length,
      subscribers: subscriptions.map((sub) => sub.subscriber),
    }, "subscribers fetched successfully"));
    
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // validate subscriber
  const subscriber = await User.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "subscriber not found");
  }

  // fetch subscribed channels
  const subscriptions = await Subscription.find({subscriber: subscriberId})
  .populate("channel", "username avatar email");

  return res
  .status(200)
  .json(new ApiResponse(200, {
    subscriber: subscriber.username,
    totalChannels: subscriptions.length,
    channels: subscriptions.map((sub) => sub.channel),
  }, "channels fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
