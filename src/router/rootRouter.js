import express from "express";
import { home } from "../controller/diaryController";
import {
  getJoin,
  postJoin,
  logout,
  getLogin,
  postLogin,
} from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.route("/:pageNumber([0-9])").get(home);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/logout").all(protectorMiddleware).get(logout);

export default rootRouter;
