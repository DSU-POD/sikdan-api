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
          id: memberId,
        },
      });

      const { age, goal, allergy } = memberInfo;

      const allergyValue = allergy === "" ? "없음" : allergy;

      const feedbackContents = await this.feedback(age, goal, foods.join(","), meals, allergyValue);

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
          attributes: ["foods", "nutrient", "total_calories", "url", "dietName", "meals"],
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
      throw new Error("피드 정보를 찾을 수 없습니다.");
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
      order: [["createdAt", "DESC"]],

      attributes: ["id", "contents", "ai_feedback", "likeNum", "commentNum", "type", "createdAt"],
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
    const totalCount = await this.FeedModel.count({
      where: {
        type,
      },
    });
    const feedList = tmpFeedList.map((feed) => ({
      ...feed.toJSON(),
      isLike: feed.feedLike.length > 0 ? true : false,
    }));
    feedList.totalCount = totalCount;

    return { feedList, totalCount };
  }

  async editFeed(id, editData, memberId) {
    const { dietName, contents } = editData;

    const findInfo = await this.FeedModel.findOne({
      where: {
        id,
      },
      attributes: ["contents", "memberId"],
      include: [
        {
          model: this.DietModel,
          as: "feedId",
          attributes: ["dietName"],
        },
      ],
    });

    //피드 찾기에서 오류
    if (!findInfo) {
      throw new Error("해당 피드를 찾을 수 없습니다.");
    }

    // 피드 작성자가 현재 요청을 보낸 사용자와 동일한지 확인
    if (findInfo.memberId !== memberId) {
      throw new Error("이 피드를 수정할 권한이 없습니다.");
    }

    const result = await findInfo.update({
      dietName,
      contents,
    });

    if (!result) {
      throw new Error("피드 수정본 업데이트에 실패하였습니다.");
    }

    return result;
  }

  async deleteFeed(id) {
    const feedInfo = await this.FeedModel.findOne({
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

  async feedback(age, goal, foods, meals, allergy) {
    const __dirname = path.resolve();
    const scriptPath = path.join(__dirname, "feedback.py");
    const feedback = await new Promise((resolve, reject, err) =>
      exec(`python3 ${scriptPath} ${age} ${goal} ${foods} ${meals} ${allergy}`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject("피드백에 실패하였습니다.");
        }
        resolve(stdout.trim());
      })
    );
    try {
      return feedback;
    } catch {
      return "";
    }
  }

  static async uploadToAzure(fileBuffer, blobName, mimeType) {
    // blob stroage client
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION);

    // blob storage의 컨테이너 client
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return blockBlobClient.url;
  }

  async report({ memberId, feedId, reason }) {
    const reportInfo = await this.ReportModel.findOne({
      where: {
        memberId,
        feedId,
      },
    });
    if (reportInfo !== null) {
      throw new Error("이미 신고 했습니다.");
    }
    const feedInfo = await this.FeedModel.findOne({
      where: {
        id: feedId,
      },
    });

    // report 테이블에 create
    const reportResult = await this.ReportModel.create({ memberId, feedId, reason });
    if (reportResult === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }

    //Feed 테이블에 ReportNum 에 +1 업데이트
    await feedInfo.increment("ReportNum", { by: 1 });

    //Feed 테이블에 ReportNum이 5개 이상이면 게시물 삭제
    if (feedInfo.ReportNum + 1 >= 5) {
      await feedInfo.destroy();
    }
    return true;
  }
}
