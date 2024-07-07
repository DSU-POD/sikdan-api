import express from "express";
const router = express.Router();

router.get("/login", function (req, res, next) {
  res.send("test");
});

export default router;
