import express from "express";
import FeedService from "../services/feed/feed.service.js";
const router = express.Router();
const feedService = new FeedService();

router.post("/like", async (req, res, next) => {
  try {
    const { memberId } = req.body;
    const { feedId } = req.body;
    if (!req.body.memberId || !req.body.feedId) {
      // 회원 또는 피드 없으면 퇴각
      throw new Error("비정상적인 접근입니다.");
    }
    const like = await feedService.like(memberId, feedId);
    next({
      data: like,
      message: "좋아요가 추가되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/likeCancel", async (req, res, next) => {
  try {
    const { memberId } = req.body;
    const { feedId } = req.body;
    if (!req.body.memberId || !req.body.feedId) {
      // 회원 또는 피드 없으면 퇴각
      throw new Error("비정상적인 접근입니다.");
    } else if (req.body.memberId === null) {
      // 좋아요 없으면 퇴각
      throw new Error("비정상적인 접근입니다.");
    }
    const likeCancel = await feedService.likeCancel(memberId, feedId);
    next({
      data: likeCancel,
      message: "좋아요가 추가되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});

router.get("/list/:page", async (req, res, next) => {
  try {
    const { page } = req.params;
    const { type } = req.query;
    if (!page || (type !== "expert" && type !== "people")) {
      throw new Error("비정상적인 접근입니다.");
    }
    const feedList = await feedService.getFeedList(page, type);
    next({
      data: feedList,
      message: "정상적으로 조회되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});
router.get("/view/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const feed = await feedService.getFeed(id);
    next({
      data: feed,
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
