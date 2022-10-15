import express from "express";
import { del, see, update } from "../controller/userController";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/:id").all(protectorMiddleware).get(see);
userRouter.route("/:id/update").all(protectorMiddleware).get(update);
userRouter.route("/:id/delete").all(protectorMiddleware).get(del);

export default userRouter;
