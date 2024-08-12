import { Op, Sequelize } from "sequelize";
import db from "../../models/index.js";
export default class FoodService {
  constructor() {
    this.FoodModel = db.FoodModel;
  }

  async getAll(name) {
    const result = await this.FoodModel.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    return result;
  }
}
