import express from "express";
import FeedService from "../services/feed/feed.service";
const router = express.Router();

router.post("/like", async (req, res, next) => {});
router.delete("/likeCancel", async (req, res, next) => {});

router.get("/list", async (req, res, next) => {});
router.get("/view/:id", async (req, res, next) => {
  try {
    const { feedId } = req.body;
    const post = await FeedService.feedPost(feedId);
    if (!post) {
      return res.status(404).send({ message: "404 err: 게시물을 찾을 수 없습니다." });
    }
    res.send(post);
  } catch (e) {
    next(e);
  }
});
router.patch("/edit/:id", async (req, res, next) => {});
router.delete("/delete/:id", async (req, res, next) => {});

export default router;
