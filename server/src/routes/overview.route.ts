import express from "express";
import { getOverviewStats } from "../controllers/overview.controller";
import { authorize, authenticate } from "../middleware/auth.middleware";
export default (router: express.Router): express.Router => {
  router
    .route("/overview")
    .get(authenticate, authorize(["dev", "admin"]), getOverviewStats); //
  return router;
};
