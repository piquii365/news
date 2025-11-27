import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
} from "../controllers/categories.controller";

export default (router: express.Router): express.Router => {
  router.route("/categories").get(getAllCategories);
  router.route("/categories/slug").get(getCategoryBySlug);
  return router;
};
