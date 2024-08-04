import express from "express";
import member from "./member.js";
import feed from "./feed.js";
import comment from "./comment.js";

const router = express.Router();
router.use("/member", member);
router.use("/feed", feed);
router.use("/comment", comment);

export default router;
