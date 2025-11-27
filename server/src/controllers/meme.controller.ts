import conn from "../config/db.config.js";
import express from "express";
import { v4 } from "uuid";
import { handleError } from "../utils/error.util.ts";
import type { JwtPayload } from "jsonwebtoken";

export const getMemes = async (req: express.Request, res: express.Response) => {
  const connection = await conn.getConnection();
  const { limit = 20 } = req.query;
  try {
    const [rows]: [any[], any] = await connection.query("CALL sp_GetMemes(?)", [
      Number(limit),
    ]);
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getMemeById = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { id } = req.params;
  try {
    const [rows]: [any[], any] = await connection.query(
      "CALL sp_GetMemeById(?)",
      [id]
    );
    // stored proc typically returns rows[0] as the result set
    res.status(200).json(rows[0][0] ?? null);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const createMeme = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { title, image_url, caption } = req.body;
  const { user } = req.user as JwtPayload;
  const memeId = v4();
  try {
    await connection.query("CALL sp_CreateMeme(?,?,?,?,?)", [
      memeId,
      user,
      title,
      image_url,
      caption,
    ]);
    res.status(201).json({ message: "Meme created", id: memeId });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const deleteMeme = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { id } = req.params;
  try {
    await connection.query("CALL sp_DeleteMeme(?)", [id]);
    res.status(200).json({ message: "Meme deleted" });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};
