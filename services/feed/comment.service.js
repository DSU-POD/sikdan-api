import { Sequelize } from "sequelize";
import db from "../../models/index.js";
export default class CommentService {
  constructor() {
    this.FeedModel = db.FeedModel;
    this.CommentModel = db.CommentModel;
    this.MemberModel = db.MemberModel;
  }

  async getAll(feedId) {
    const feedInfo = await this.FeedModel.findOne({
      where: {
        id: feedId,
      },
    });

    if (feedInfo === null) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    //댓글 불러오는거 include.model.getTableName is not a function 오류 고치기
    const commentList = await this.CommentModel.findAll({
      where: {
        feedId,
      },
      order: [["createdAt", "DESC"]],
      include: {
        model: this.MemberModel,
        as: "memberComment",
        attributes: ["userId", "nickname"],
      },
    });

    return commentList;
  }
  async create({ memberId, feedId, contents }) {
    const feedInfo = await this.FeedModel.findOne({
      where: {
        id: feedId,
      },
    });

    if (feedInfo === null) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const result = await this.CommentModel.create({
      memberId,
      feedId,
      contents,
    });

    if (result === null) {
      throw new Error("댓글 등록에 실패하였습니다.");
    }

    await feedInfo.increment("commentNum", {
      by: 1,
    });

    return true;
  }

  async update({ id, memberId, contents }) {
    const commentInfo = await this.CommentModel.findOne({
      where: {
        id,
        memberId,
      },
    });

    if (commentInfo === null) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const result = await commentInfo.update({
      contents,
    });

    if (result === null) {
      throw new Error("댓글 수정에 실패하였습니다.");
    }

    return true;
  }

  async delete({ commentId, memberId, feedId }) {
    const commentInfo = await this.CommentModel.findOne({
      where: {
        id: commentId,
        feedId,
        memberId,
      },
    });

    if (commentInfo === null) {
      throw new Error("이미 삭제된 댓글입니다.");
    }

    const result = await commentInfo.destroy();
    if (!result) {
      throw new Error("댓글 삭제에 실패하였습니다.");
    }

    await this.FeedModel.update(
      {
        commentNum: Sequelize.literal("commentNum - 1"),
      },
      {
        where: {
          id: feedId,
          memberId,
        },
      }
    );
    return result;
  }
}
