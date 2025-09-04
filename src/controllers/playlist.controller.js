import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist

  if (!name) {
    throw new ApiError(400, "name is required");
  }

  if (!description) {
    throw new ApiError(400, "description is required");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: new mongoose.Types.ObjectId(req.user?._id),
    videos: [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "user id is invalid");
  }

  const playlists = await Playlist.find({ owner: userId })
    .sort({ createdAt: -1 })
    .select("-__v");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: playlists.length,
        playlists,
      },
      "playlists fetched successfully"
    )
  );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is invalid");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate("owner", "username")
    .populate("videos");

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is invalid");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video id is invalid");
  }

  // TODO: add video to playlist
  // first find the playlist

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  // then add the video to the playlist

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "you are not authorized to add video to this playlist"
    );
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: new mongoose.Types.ObjectId(videoId),
      },
    },
    { new: true }
  ).populate("videos");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist: updatedPlaylist },
        "video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is invalid");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video id is invalid");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "you are not authorized to remove video from this playlist"
    );
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: new mongoose.Types.ObjectId(videoId),
      },
    },
    { new: true }
  ).populate("videos");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist: updatedPlaylist },
        "video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is invalid");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "you are not authorized to delete this playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is invalid");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "you are not authorized to update this playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist: updatedPlaylist },
        "playlist updated successfully"
      )
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
