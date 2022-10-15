import express from "express";
import { del, see, getWrite, postWrite, getEdit, postEdit } from "../controller/diaryController";
import { protectorMiddleware } from "../middlewares";

const diaryRouter = express.Router();

diaryRouter.route("/write").all(protectorMiddleware).get(getWrite).post(postWrite);
diaryRouter.route("/:id([0-9a-f]{24})").get(see);
diaryRouter.route("/:id([0-9a-f]{24})/update").all(protectorMiddleware).get(getEdit).post(postEdit);
diaryRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(del);

export default diaryRouter;
