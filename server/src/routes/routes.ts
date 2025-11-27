import express from "express";
import authRoutes from "./auth.routes";
import featuredRoutes from "./featured.routes";
import categoriesRoutes from "./categories.routes";
import commentsRoutes from "./comments.routes";
import overviewRoute from "./overview.route";
import memesRoutes from "./memes.routes";
import boxedRoutes from "./boxed.routes";

const router = express.Router();

export default (): express.Router => {
  authRoutes(router);
  featuredRoutes(router);
  categoriesRoutes(router);
  commentsRoutes(router);
  overviewRoute(router);
  memesRoutes(router);
  boxedRoutes(router);
  return router;
};
