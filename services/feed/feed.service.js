import db from "../../models/index.js";
import { BlobServiceClient } from "@azure/storage-blob";
import { exec } from "child_process";
import path from "path";
import { Sequelize } from "sequelize";

export default class FeedService {
  constructor() {
    this.FeedModel = db.FeedModel;
    this.LikeModel = db.LikeModel;
    this.MemberModel = db.MemberModel;
    this.DietModel = db.DietModel;
    this.CommentModel = db.CommentModel;
    this.sequelize = db.sequelize;
  }

  async write(predict, writeData) {
    const transaction = await this.sequelize.transaction();

    try {
      const { total_calories, foods, nutrient, url } = predict;
      const { contents, dietName, memberId, meals } = writeData;
      const dietResult = await this.DietModel.create({
        total_calories,
        foods: JSON.stringify(foods),
        nutrient: JSON.stringify(nutrient),
        url,
        dietName,
        meals,
      });

      const feedResult = await this.FeedModel.create({
        dietId: dietResult.id,
        contents,
        memberId,
      });

      const memberInfo = await this.MemberModel.findOne({
        where: {
          memberId,
        },
      });

      const { age, goal } = memberInfo;

      const feedbackContents = await this.feedback(
        age,
        goal,
        foods.join(","),
        meals
      );
      await this.FeedModel.update(
        {
          ai_feedback: feedbackContents,
        },
        {
          where: {
            id: feedResult.id,
          },
        }
      );

      await transaction.commit();

      return feedResult.id;
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw new Error("피드를 작성하는 중 오류가 발생하였습니다.");
    }
  }

  async updateFeedback(aiFeedBack) {}

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

  async getFeed(id, memberId) {
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
          where: {
            feedId: id,
            memberId,
          },
          required: false,
        },
        {
          model: this.DietModel,
          as: "feedDiet",
          attributes: [
            "foods",
            "nutrient",
            "total_calories",
            "url",
            "dietName",
          ],
        },
        {
          model: this.CommentModel,
          as: "feedComment",
          required: false,
          include: {
            model: this.MemberModel,
            as: "memberComment",
            attributes: ["userId", "nickname"],
          },
        },
        {
          model: this.MemberModel,
          as: "memberFeed",
          attributes: ["userId", "nickname"],
        },
      ],
      order: [["feedComment", "createdAt", "DESC"]], // 최상위에 위치한 order
    });
    if (feedInfo === null) {
      throw new Error("피드 정보를 찾을수 없습니다.");
    }

    feedInfo.feedDiet.nutrient = JSON.parse(feedInfo.feedDiet.nutrient);
    return feedInfo;
  }

  async getFeedList(page, type) {
    let offset = 0;
    if (page > 1) {
      offset = 10 * (page - 1);
    }

    const tmpFeedList = await this.FeedModel.findAll({
      limit: 10,
      offset,
      where: {
        type,
      },

      attributes: [
        "id",
        "contents",
        "ai_feedback",
        "likeNum",
        "commentNum",
        "type",
        "createdAt",
      ],
      include: [
        {
          model: this.LikeModel,
          as: "feedLike",
          attributes: ["memberId"],
        },
        {
          model: this.DietModel,
          as: "feedDiet",
          attributes: ["url"],
        },
        {
          model: this.MemberModel,
          as: "memberFeed",
          attributes: ["userId", "nickname"],
        },
        {
          model: this.CommentModel,
          as: "feedComment",

          limit: 3,
          attributes: ["memberId", "contents"],
          required: false,
          include: {
            model: this.MemberModel,
            as: "memberComment",
            attributes: ["userId", "nickname"],
          },
        },
      ],
    });

    if (tmpFeedList === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }

    const feedList = tmpFeedList.map((feed) => ({
      ...feed.toJSON(),
      isLike: feed.feedLike.length > 0 ? true : false,
    }));
    return feedList;
  }

  async deleteFeed(id) {
    const feedInfo = await this.FeedModel.getOne({
      where: {
        id,
      },
    });

    await feedInfo.destroy();
  }

  async predict(url) {
    const __dirname = path.resolve();
    const scriptPath = path.join(__dirname, "predict.py");
    const predict = await new Promise((resolve, reject, err) =>
      exec(`python3 ${scriptPath} ${url}`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject("예측에 실패하였습니다.");
        }
        resolve(stdout.trim());
      })
    );
    try {
      return JSON.parse(predict);
    } catch {
      return `{
        foods: [],
      }`;
    }
  }
  async feedback(url) {
    const __dirname = path.resolve();
    const scriptPath = path.join(__dirname, "predict.py");
    const predict = await new Promise((resolve, reject, err) =>
      exec(`python3 ${scriptPath} ${url}`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject("예측에 실패하였습니다.");
        }
        resolve(stdout.trim());
      })
    );
    try {
      return JSON.parse(predict);
    } catch {
      return `{
        foods: [],
      }`;
    }
  }

  static async uploadToAzure(fileBuffer, blobName, mimeType) {
    // blob stroage client
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_CONNECTION
    );

    // blob storage의 컨테이너 client
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_CONTAINER_NAME
    );

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return blockBlobClient.url;
  }
}
