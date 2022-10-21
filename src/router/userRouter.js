import express from "express";
import {
  finishGithubLogin,
  see,
  startGithubLogin,
  getUpdate,
  postUpdate,
  getChangePassword,
  postChangePassword,
} from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/:id([0-9a-f]{24})").all(protectorMiddleware).get(see);
userRouter
  .route("/:id([0-9a-f]{24})/update")
  .all(protectorMiddleware)
  .get(getUpdate)
  .post(postUpdate);
userRouter
  .route("/:id([0-9a-f]{24})/changePassword")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
export default userRouter;
