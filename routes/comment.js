import express from "express";
import CommentService from "../services/feed/comment.service.js";
import JwtStrateGy from "../auth/jwt.strategy.js";
const router = express.Router();
const commentService = new CommentService();

router.post("/add", async (req, res, next) => {
  try {
    const { feedId, contents } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { memberId } = await JwtStrateGy.validateJwt(token);

    if (!memberId || !feedId || !contents) {
      throw new Error("비정상적인 접근입니다.");
    }

    const result = await commentService.create({
      memberId,
      feedId,
      contents,
    });

    next({
      data: result,
      message: "댓글이 작성 되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});
router.patch("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contents } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { memberId } = await JwtStrateGy.validateJwt(token);

    if (!id) {
      throw new Error("비정상적인 접근입니다.");
    }

    await commentService.update({
      id,
      memberId,
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
    const { feedId } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { memberId } = await JwtStrateGy.validateJwt(token);

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

router.get("/:feedId", async (req, res, next) => {
  try {
    if (!req.params.feedId) {
      throw new Error("비정상적인 접근입니다.");
    }

    const { feedId } = req.params;

    const result = await commentService.getAll(feedId);
    next({
      data: result,
      message: "정상적으로 조회되었습니다.",
    });
  } catch (e) {
    next(e);
  }
});
export default router;
