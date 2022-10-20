import express from "express";
import {
  del,
  finishGithubLogin,
  see,
  startGithubLogin,
  update,
} from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/:id([0-9a-f]{24})").all(protectorMiddleware).get(see);
userRouter
  .route("/:id([0-9a-f]{24})/update")
  .all(protectorMiddleware)
  .get(update);
userRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(del);

export default userRouter;
