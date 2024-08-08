import db from "../../models/index.js";

export default class FeedService {
  constructor() {
    this.FeedModel = db.FeedModel;
    this.LikeModel = db.LikeModel;
    this.MemberModel = db.MemberModel;
  }
  async like(memberId, feedId) {
    const feedInfo = await this.FeedModel.getOne({
      where: {
        memberId,
        id: feedId,
      },
    });
    if (feedInfo === null) {
      throw new Error();
    }
    // 좋아요가 이미 있는지 검사
    const { memberId } = feedInfo;
    if ({ memberId } != null) {
      throw new Error();
    }
    // like 테이블에 create
    const likeResult = await this.LikeModel.create({ memberId, feedId });
    if (likeResult === null) {
      throw new Error();
    }
    //Feed 테이블에 likeNum 에 +1 업데이트
    await feedInfo.increment("LikeNum", { by: 1 });

    return true;
  }

  async likeCancel(memberId, feedId) {
    const feedInfo = await this.FeedModel.getOne({
      where: {
        memberId,
        id: feedId,
      },
    });
    if (feedInfo === null) {
      throw new Error();
    }
    // 좋아요가 없는지 검사
    const { memberId } = feedInfo;
    if (({ memberId } = null)) {
      throw new Error();
    }
    // like 테이블에 destroy
    const likeResult = await this.LikeModel.destroy({ memberId, feedId });
    if (likeResult !== null) {
      throw new Error();
    }
    //Feed 테이블에 likeNum 에 -1 업데이트
    await feedInfo.increment("LikeNum", { by: -1 });

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
      throw new Error();
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
      throw new Error();
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
