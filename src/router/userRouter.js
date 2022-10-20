import express from "express";
import { del, finishGithubLogin, see, startGithubLogin, update } from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/:id").all(protectorMiddleware).get(see);
userRouter.route("/:id/update").all(protectorMiddleware).get(update);
userRouter.route("/:id/delete").all(protectorMiddleware).get(del);

export default userRouter;
