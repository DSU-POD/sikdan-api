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
