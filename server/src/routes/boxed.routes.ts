import express from "express";
import {
  getBoxedArticles,
  getBoxedArticleById,
  createBoxedArticle,
} from "../controllers/boxed.controller.js";
import { authenticate, authorize } from "src/middleware/auth.middleware.js";

export default (router: express.Router): express.Router => {
  router.get("/boxed", getBoxedArticles);
  router.get("/boxed/:id", getBoxedArticleById);
  router
    .route("/boxed")
    .post(authenticate, authorize(["admin", "dev"]), createBoxedArticle);
  return router;
};
