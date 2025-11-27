import conn from "../config/db.config.js";
import express from "express";
import { v4 } from "uuid";

interface Session {
  req?: express.Request;
  userId: string;
  authAccountId: number;
  sessionId?: string;
}
export async function getSession(sessionId: string) {
  const connection = await conn.getConnection();
  try {
    const [rows]: [any[], any] = await connection.query(
      "CALL sp_get_session(?)",
      [sessionId]
    );
    return rows[0]?.[0];
  } catch (error: any) {
    throw new Error(error.message || "Failed to get session");
  } finally {
    connection.release();
  }
}
export async function addSession(session: Session): Promise<string> {
  const connection = await conn.getConnection();
  try {
    const ipAddress =
      session?.req?.ip ||
      session?.req?.headers["x-forwarded-for"] ||
      session?.req?.socket.remoteAddress;
    const userAgent = session?.req?.headers["user-agent"] || "unknown";
    const sessionId = v4();

    await connection.query("CALL sp_create_session(?, ?, ?, ?, ?)", [
      sessionId,
      session.userId,
      session.authAccountId,
      ipAddress,
      userAgent,
    ]);
    return sessionId;
  } catch (error: any) {
    console.error("Error in addSession:", error);
    throw new Error(error.message || "Failed to create session");
  } finally {
    connection.release();
  }
}
export async function deleteSession(session: Session): Promise<boolean> {
  const connection = await conn.getConnection();
  try {
    const [result]: [any[], any] = await connection.query(
      "CALL sp_delete_user_session(?, ?, ?)",
      [session.sessionId, session.userId, session.authAccountId]
    );
    return true;
  } catch (error: any) {
    console.error("Error in deleting Session:", error);
    throw new Error(error.message || "Failed to delete session");
  } finally {
    connection.release();
  }
}
