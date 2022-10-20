import express from "express";
import { del, see, startGithubLogin, update } from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin)
userRouter.route("/:id").all(protectorMiddleware).get(see);
userRouter.route("/:id/update").all(protectorMiddleware).get(update);
userRouter.route("/:id/delete").all(protectorMiddleware).get(del);

export default userRouter;
