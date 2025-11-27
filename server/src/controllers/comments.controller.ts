import conn from "../config/db.config.js";
import express from "express";
import { v4 } from "uuid";
import { handleError } from "../utils/error.util.ts";
import type { JwtPayload } from "jsonwebtoken";

export const getCommentsByPost = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { postId } = req.params;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetCommentsByPost(?)",
      [postId]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const addComment = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { content } = req.body;
  const { userId } = req.user as JwtPayload;
  const { postId } = req.params;
  const { ParentId } = req.query;
  const commentId = v4();
  try {
    await connection.query("CALL sp_CreateComment", [
      postId,
      userId,
      commentId,
      ParentId,
      content,
    ]);
    res.status(201).json({ message: "Comment added successfully", commentId });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};
