import express from "express";
import { registerView } from "../controller/diaryController";

const apiRouter = express.Router();

apiRouter.route("/:id([0-9a-f]{24})/views").post(registerView);

export default apiRouter;
