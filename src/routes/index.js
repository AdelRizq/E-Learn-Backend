const express = require("express");

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const courseRouter = require("./courseRouter");
const activityRouter = require("./activityRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/activities", activityRouter);

module.exports = router;
