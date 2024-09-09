import express from "express";
import FeedService from "../services/feed/feed.service.js";
import multer from "multer";
import path from "path";
import JwtStrateGy from "../auth/jwt.strategy.js";
const router = express.Router();
const feedService = new FeedService();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/write", async (req, res, next) => {
  try {
    const { predict, writeData } = req.body;
    if (!predict || !writeData) {
      throw new Error("올바르지 못한 접근입니다.");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = await JwtStrateGy.validateJwt(token);

    writeData.memberId = decoded.memberId;
    const result = await feedService.write(predict, writeData);
    next({
      message: "정상적으로 피드가 작성되었습니다.",
      data: result,
    });
  } catch (e) {
    next(e);
  }
});
router.post("/predict", upload.single("file"), async (req, res, next) => {
  try {
    const blobName = Date.now() + path.extname(req.file.originalname);
    const url = await FeedService.uploadToAzure(
      req.file.buffer,
      blobName,
      req.file.mimetype
    );

    const predict = await feedService.predict(url);
    console.log(predict);
    next({
      message: "정상적으로 업로드 되었습니다.",
      data: {
        predict,
        url,
      },
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.post("/like", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await JwtStrateGy.validateJwt(token);
    const memberId = decoded.memberId;
    const { feedId } = req.body;
    if (!memberId || !feedId) {
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
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await JwtStrateGy.validateJwt(token);
    const memberId = decoded.memberId;

    const { feedId } = req.body;
    if (!memberId || !feedId) {
      throw new Error("비정상적인 접근입니다.");
    }
    const likeCancel = await feedService.likeCancel(memberId, feedId);
    next({
      data: likeCancel,
      message: "좋아요가 삭제되었습니다.",
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
    const token = req.headers.authorization.split(" ")[1];
    const { memberId } = await JwtStrateGy.validateJwt(token);

    const feed = await feedService.getFeed(id, memberId);
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
