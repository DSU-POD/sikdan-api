import FeedModel from "../../models/Feed/Feed.model.js";

export default class FeedService {
  constructor() {}

  async getFeed(id) {
    // 피드 아이디가 있는지 확인
    const feedInfo = await FeedModel.findOne({
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
    const feedInfo = await FeedModel.findOne({
      where: {
        id,
      },
    });
    const { FeedModel } = findInfo;
    const feeddes = await FeedModel.destroy({
      where: {
        FeedModel,
      },
    });
  }
}
