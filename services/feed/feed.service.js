import db from "../../models/index.js";

export default class FeedService {
  constructor() {
    this.FeedModel = db.FeedModel;
  }

  async getFeed(id) {
    // 피드 아이디가 있는지 확인
    const feedInfo = await this.FeedModel.findOne({
      where: {
        id,
      },
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
