import express from "express";
import {
  getMemeById,
  getMemes,
  createMeme,
} from "../controllers/meme.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
export default (router: express.Router): express.Router => {
  router.get("/memes", getMemes);
  router.get("/memes/:id", getMemeById);
  router
    .route("/memes")
    .post(authenticate, authorize(["admin", "dev"]), createMeme);
  return router;
};
