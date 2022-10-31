import express from "express";
import {
  finishGithubLogin,
  see,
  getEdit,
  postEdit,
  startGithubLogin,
  getChangePassword,
  postChangePassword,
  delUser,
} from "../controller/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUrlUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/:id([0-9a-f]{24})").get(see);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUrlUpload.single("avatarUrl"), postEdit);
userRouter
  .route("/:id([0-9a-f]{24})/changePassword")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(delUser);

export default userRouter;
