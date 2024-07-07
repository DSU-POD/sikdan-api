import express from "express";
const router = express.Router();

router.post("/login", function (req, res, next) {
  res.send("test");
});

export default router;
