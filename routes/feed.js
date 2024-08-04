import express from "express";
const router = express.Router();

router.post("/like", async (req, res, next) => {});
router.delete("/likeCancel", async (req, res, next) => {});

router.get("/list", async (req, res, next) => {});
router.get("/view/:id", async (req, res, next) => {});
router.patch("/edit/:id", async (req, res, next) => {});
router.delete("/delete/:id", async (req, res, next) => {});

export default router;
