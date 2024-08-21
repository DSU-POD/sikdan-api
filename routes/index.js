import express from "express";
import member from "./member.js";
import feed from "./feed.js";
import comment from "./comment.js";
import food from "./food.js";

const router = express.Router();
router.use("/member", member);
router.use("/feed", feed);
router.use("/comment", comment);
router.use("/food", food);

export default router;
