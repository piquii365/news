import conn from "../config/db.config.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { addSession } from "../middleware/session.middleware";
import { v4 } from "uuid";
import { handleError } from "../utils/error.util.ts";
import { getSession, deleteSession } from "../middleware/session.middleware";
type Role = "user" | "admin" | "dev";

interface UserSession {
  user_id: string;
  full_name: string;
  email: string;
  auth_account_id: number;
  provider_name: string;
  username: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  session_created_at: Date;
  last_activity: Date;
  session_is_active: boolean;
}
interface JwtPayload {
  sessionId: string;
  user: string; // user_id
  authAccount: number; // auth_account
  role: Role;
  iat?: number;
  exp?: number;
}

export const register = async (req: express.Request, res: express.Response) => {
  const connection = await conn.getConnection();
  const { username, email, password, fullName } = req.body;
  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }
    const userId = v4();
    const providerId = 1;
    const providerUserId = userId;
    const passwordHash = await bcrypt.hash(password, 10);

    await connection.query(
      "CALL sp_add_user(?, ?, ?, ?, ?, ?, ?, @auth_account)",
      [
        userId,
        fullName,
        email,
        providerId,
        username,
        passwordHash,
        providerUserId,
      ]
    );
    const [rows]: [any[], any] = await connection.query(
      "SELECT @auth_account AS auth_account"
    );
    const auth_account = rows[0].auth_account;
    const session = {
      req,
      userId: userId,
      authAccountId: auth_account,
    };
    const sessionId = await addSession(session);
    const token = jwt.sign(
      { sessionId, user: userId, authAccount: auth_account, role: "user" },
      process.env.JWT_SECRET || "secrect_key_10v11",
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error: unknown) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  const connection = await conn.getConnection();
  const { user, password } = req.body;
  try {
    if (!user || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const [rows]: [any[], any] = await connection.query(
      "CALL sp_get_user_auth_info(?)",
      [user]
    );

    const authInfo = rows[0][0];

    if (!authInfo) {
      res.status(400).json({ message: "Invalid username or password." });
      return;
    }

    if (!(await bcrypt.compare(password, authInfo.password_hash))) {
      await connection.query(
        "CALL sp_create_login_log(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          authInfo.user_id, // p_user_id
          authInfo.auth_account, // p_auth_account_id
          1, // p_provider_id (assuming 1 is your default provider)
          user, // p_username_attempted
          req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress, // p_ip_address
          req.headers["user-agent"] || "unknown", // p_user_agent
          0, // p_success (false)
          "Incorrect Password", // p_message
        ]
      );
      res.status(401).json({
        message: "Login Failed Check Your Credentials",
      });
      return;
    }
    // Successful login log
    await connection.query("CALL sp_create_login_log(?, ?, ?, ?, ?, ?, ?, ?)", [
      authInfo.user_id, // p_user_id
      authInfo.auth_account, // p_auth_account_id
      1, // p_provider_id
      user, // p_username_attempted
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress, // p_ip_address
      req.headers["user-agent"] || "unknown", // p_user_agent
      1, // p_success (true)
      "Success", // p_message
    ]);
    const session = {
      req,
      userId: authInfo.user_id,
      authAccountId: authInfo.auth_account,
    };
    const sessionId = await addSession(session);
    const token = jwt.sign(
      {
        sessionId,
        user: authInfo.user_id,
        authAccount: authInfo.auth_account,
        role: authInfo.role,
      },
      process.env.JWT_SECRET || "secrect_key_10v11",
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Login Success" });
  } catch (error: unknown) {
    await connection.query("CALL sp_create_login_log(?, ?, ?, ?, ?, ?, ?, ?)", [
      null, // p_user_id (NULL since account doesn't exist)
      null, // p_auth_account_id (NULL)
      1, // p_provider_id
      user, // p_username_attempted
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      req.headers["user-agent"] || "unknown",
      0, // p_success (false)
      "Account Not Registered", // p_message
    ]);
    handleError(res, error);
  } finally {
    connection.release();
  }
};
export const currentUser = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { sessionId, user: userId, authAccount } = req.user as JwtPayload;
  try {
    const [rows]: [any[], any] = await connection.query(
      "CALL sp_get_user_by_session(?, ?, ?)",
      [sessionId, userId, authAccount]
    );
    res.status(200).json((rows[0]?.[0] as UserSession) ?? null);
  } catch (error) {
    handleError(res, error);
  } finally {
  }
};
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response
) => {
  const { sessionId } = req.user as JwtPayload;
  try {
    const activeSession = await getSession(sessionId);
    if (!activeSession) {
      res.status(401).json({ status: false });
      return;
    }
    res.status(200).json({ status: true });
  } catch (error) {
    handleError(res, error);
  }
};
export const logout = async (req: express.Request, res: express.Response) => {
  const {
    sessionId,
    user: userId,
    authAccount: authAccountId,
  } = req.user as JwtPayload;
  try {
    const session = { sessionId, userId, authAccountId };
    await deleteSession(session);
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(203);
  } catch (error) {
    handleError(res, error);
  }
};
