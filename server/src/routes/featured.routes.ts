import express from "express";
import { authenticate, authorize } from "src/middleware/auth.middleware";
import {
  getFeatured,
  getPostsByCategory,
  getPopularPosts,
  getPostBySlug,
  createPost,
  searchPosts,
  getPostsByType,
} from "../controllers/featured.controller";

export default (router: express.Router): express.Router => {
  router.route("/featured").get(getFeatured);
  router.route("/featured/category/:categorySlug").get(getPostsByCategory);
  router.route("/featured/popular").get(getPopularPosts);
  router.route("/posts/:slug").get(getPostBySlug);
  router
    .route("/posts")
    .post(authenticate, authorize(["admin", "dev"]), createPost);
  router.route("/search/post/:categorySlug").get(searchPosts);
  router.route("/featured/type").get(getPostsByType);
  return router;
};
