import express from "express";
import FeedService from "../services/feed/feed.service.js";
const router = express.Router();
const feedService = new FeedService();

router.post("/like", async (req, res, next) => {});
router.delete("/likeCancel", async (req, res, next) => {});

router.get("/list", async (req, res, next) => {});
router.get("/view/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await feedService.getFeed(id);
    next({
      data: post,
      message: "조회 되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});
router.patch("/edit/:id", async (req, res, next) => {});
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await feedService.deleteFeed(id);
    next({
      data: post,
      message: "삭제 되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});

export default router;
