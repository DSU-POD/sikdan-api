import express from "express";
const router = express.Router();

router.get("/list/:id", async (req, res, next) => {});
router.post("/add/:id", async (req, res, next) => {});
router.patch("/edit/:id", async (req, res, next) => {});
router.delete("/delete/:id", async (req, res, next) => {});

export default router;
