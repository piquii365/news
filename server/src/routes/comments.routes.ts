import express from "express";
import {
  getCommentsByPost,
  addComment,
} from "../controllers/comments.controller";

import { authenticate, authorize } from "../middleware/auth.middleware";

export default (router: express.Router): express.Router => {
  router.route("/comments/post/:postId").get(getCommentsByPost);
  router
    .route("/comments")
    .post(authenticate, authorize(["user", "dev"]), addComment);
  return router;
};
