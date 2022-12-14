import express from "express";
import {
  del,
  see,
  getWrite,
  postWrite,
  getEdit,
  postEdit,
  getSearch,
  postSearch,
} from "../controller/diaryController";
import { protectorMiddleware, imageFileUpload } from "../middlewares";

const diaryRouter = express.Router();

diaryRouter
  .route("/write")
  .all(protectorMiddleware)
  .get(getWrite)
  .post(imageFileUpload.single("imageFile"), postWrite);
diaryRouter.route("/search").get(getSearch).post(postSearch);
diaryRouter.route("/:id([0-9a-f]{24})").get(see);
diaryRouter
  .route("/:id([0-9a-f]{24})/update")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
diaryRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(del);

export default diaryRouter;
