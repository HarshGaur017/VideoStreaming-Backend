import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);

router.route("/:playlistId").get(getPlaylistById);

router.route("/user/:userId").get(getUserPlaylists);

export default router;
