import express from "express";
import FoodService from "../services/food/food.service.js";
const router = express.Router();
const foodService = new FoodService();

//router.get("/", async () => {});
router.get("/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    if (!name) {
      throw new Error("비정상적인 접근입니다.");
    }
    const foodList = await foodService.getAll(name);
    next({
      message: "정상적으로 조회되었습니다.",
      data: foodList,
    });
  } catch (e) {
    next(e);
  }
});
export default router;
