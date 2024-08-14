import db from "../../models/index.js";

export default class FeedService {
  constructor() {
    this.FeedModel = db.FeedModel;
    this.LikeModel = db.LikeModel;
    this.MemberModel = db.MemberModel;
  }
  async like(memberId, feedId) {
    const likeInfo = await this.LikeModel.findOne({
      where: {
        memberId,
        feedId,
      },
    });
    if (likeInfo !== null) {
      throw new Error("이미 좋아요를 했습니다.");
    }
    const feedInfo = await this.FeedModel.findOne({
      where: {
        memberId,
        id: feedId,
      },
    });
    // like 테이블에 create
    const likeResult = await this.LikeModel.create({ memberId, feedId });
    if (likeResult === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }
    //Feed 테이블에 likeNum 에 +1 업데이트
    await feedInfo.increment("LikeNum", { by: 1 });

    return true;
  }

  async likeCancel(memberId, feedId) {
    const likeInfo = await this.LikeModel.findOne({
      where: {
        memberId,
        feedId,
      },
    });
    if (likeInfo === null) {
      throw new Error("이미 좋아요 취소 처리 되었습니다.");
    }
    const feedInfo = await this.FeedModel.findOne({
      where: {
        memberId,
        id: feedId,
      },
    });
    // like 테이블에 create
    const likeResult = await likeInfo.destroy({ memberId, feedId });
    if (likeResult === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }
    //Feed 테이블에 likeNum 에 +1 업데이트
    await feedInfo.decrement("LikeNum", { by: 1 });

    return true;
  }

  async getFeed(id) {
    // 피드 아이디가 있는지 확인
    const feedInfo = await this.FeedModel.getOne({
      where: {
        id,
      },
      include: [
        {
          model: this.LikeModel,
          as: "feedLike",
          attributes: ["memberId"],
        },
        {
          model: this.MemberModel,
          as: "memberFeed",
          attributes: ["userId", "nickname"],
        },
      ],
    });
    if (feedInfo === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }
    return feedInfo;
  }

  async getFeedList(page, type) {
    let offset = 0;
    if (page > 1) {
      offset = 10 * (page - 1);
    }
    // 피드 아이디가 있는지 확인
    const feedInfo = await this.FeedModel.getAll({
      limit: 10,
      offset,
      where: {
        type,
      },
      attributes: ["id", "subject", "contents", "ai_feedback", "likeNum", "commentNum"],
      include: [
        {
          model: this.LikeModel,
          as: "feedLike",
          attributes: ["memberId"],
        },
        {
          model: this.MemberModel,
          as: "memberFeed",
          attributes: ["userId", "nickname"],
        },
      ],
    });
    if (feedInfo === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }
    return feedInfo;
  }

  async deleteFeed(id) {
    const feedInfo = await this.FeedModel.getOne({
      where: {
        id,
      },
    });

    await feedInfo.destroy();
  }
}
