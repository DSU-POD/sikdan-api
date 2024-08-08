import db from "../../models/index.js";

export default class FeedService {
  constructor() {
    this.FeedModel = db.FeedModel;
    this.LikeModel = db.LikeModel;
    this.MemberModel = db.MemberModel;
  }

  async getFeed(id) {
    // 피드 아이디가 있는지 확인
    const feedInfo = await this.FeedModel.findOne({
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
      throw new Error("404 err");
    }
    return feedInfo;
  }

  async getFeedList(page, type) {
    let offset = 0;
    if (page > 1) {
      offset = 10 * (page - 1);
    }
    // 피드 아이디가 있는지 확인
    const feedInfo = await this.FeedModel.findAll({
      limit: 10,
      offset,
      where: {
        type,
      },
      attributes: [
        "id",
        "subject",
        "contents",
        "ai_feedback",
        "likeNum",
        "commentNum",
      ],
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
      throw new Error("404 err");
    }
    return feedInfo;
  }

  async deleteFeed(id) {
    const feedInfo = await this.FeedModel.findOne({
      where: {
        id,
      },
    });
    const { FeedModel } = findInfo;
    const feedDes = await this.FeedModel.destroy({
      where: {
        FeedModel,
      },
    });
  }
}
