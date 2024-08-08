import express from "express";
import CommentService from "../services/feed/comment.service.js";
const router = express.Router();
const commentService = new CommentService();

router.post("/add", async (req, res, next) => {
  try {
    const { memberId, feedId, contents } = req.body;
    if (!memberId || !feedId || !contents) {
      throw new Error("비정상적인 접근입니다.");
    }

    await commentService.create({
      memberId,
      feedId,
      contents,
    });
  } catch (e) {
    next(e);
  }
});
router.patch("/edit/:id", async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const { feedId, memberId, contents } = req.body;

    if (!commentId || !feedId) {
      throw new Error("비정상적인 접근입니다.");
    }

    await commentService.update({
      commentId,
      memberId,
      feedId,
      contents,
    });
    next({
      message: "정상적으로 수정 되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const { feedId, memberId } = req.body;

    if (!commentId || !feedId) {
      throw new Error("비정상적인 접근입니다.");
    }

    await commentService.delete({
      commentId,
      memberId,
      feedId,
    });
    next({
      message: "정상적으로 삭제 되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});

export default router;
