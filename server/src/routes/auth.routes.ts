import express from "express";
import { authLimiter } from "src/middleware/limit.middleware";
import { authenticate } from "./../middleware/auth.middleware";
import {
  register,
  login,
  isAuthenticated,
  logout,
  currentUser,
} from "../controllers/auth.controller";
import {
  validateLogin,
  validateRegistration,
  handleValidationErrors,
} from "../middleware/validation.middleware";

export default (router: express.Router): express.Router => {
  router
    .route("/auth/register")
    .post(validateRegistration, handleValidationErrors, register);
  router
    .route("/auth/login")
    .post(validateLogin, handleValidationErrors, login);
  router.route("/auth/validate").get(authenticate, isAuthenticated);
  router.route("/auth/me").get(authLimiter, authenticate, currentUser);
  router.route("/auth/logout").post(logout);
  return router;
};
