import conn from "../config/db.config.js";
import express from "express";
import { handleError } from "../utils/error.util.ts";

export const getBoxedArticles = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { limit } = req.query;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetBoxedArticles(?)",
      [limit]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getBoxedArticleById = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { id } = req.params;
  try {
    const [rows]: [any, any] = await connection.query(
      "CALL sp_GetBoxedArticleById(?)",
      [id]
    );

    // rows[0] -> article result set, rows[1] -> comments result set
    const article = Array.isArray(rows[0]) ? rows[0][0] ?? null : null;
    const comments = Array.isArray(rows[1]) ? rows[1] : [];

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ article, comments });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const createBoxedArticle = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  try {
    const { title, image_url, content, category_id } = req.body;
    const { user } = req.user || {};

    if (!title || !content || !category_id) {
      return res
        .status(400)
        .json({ message: "title, content and category_id are required" });
    }
    const [rows]: [any, any] = await connection.query(
      "CALL sp_CreateBoxedArticle(?, ?, ?, ?, ?)",
      [title, image_url || null, content, user, category_id]
    );

    // Expecting SELECT LAST_INSERT_ID() as new_article_id;
    const newId =
      Array.isArray(rows[0]) && rows[0][0] ? rows[0][0].new_article_id : null;

    res.status(201).json({ new_article_id: newId });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};
