import conn from "../config/db.config.js";
import express from "express";
import { v4 } from "uuid";
import { handleError } from "../utils/error.util.ts";

export const getAllCategories = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetAllCategories()",
      []
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getCategoryBySlug = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { slug } = req.query;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetCategoryBySlug(?)",
      [slug]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};
