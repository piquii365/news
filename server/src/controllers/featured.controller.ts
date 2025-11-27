import conn from "../config/db.config.js";
import express from "express";
import { v4 } from "uuid";
import { handleError } from "../utils/error.util.ts";

export const getFeatured = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { count = 20 } = req.query;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetFeaturedPosts(?)",
      [count]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getPostsByCategory = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { limit = 20, offset = 1 } = req.query;
  const { categorySlug } = req.params;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetPostsByCategory(?,?,?)",
      [categorySlug, limit, offset]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getPopularPosts = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { limit = 10, days = 10000 } = req.query;

  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetPopularPosts(?,?)",
      [limit, days]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getPostBySlug = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { slug } = req.params;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetPostBySlug(?)",
      [slug]
    );
    res.status(200).json(rows[0][0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const createPost = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const {
    author_id,
    category_id,
    title,
    slug,
    excerpt,
    content,
    featured_image,
    status,
  } = req.body;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_CreatePost(?,?,?,?,?,?,?,?)",
      [
        author_id,
        category_id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        status,
      ]
    );
    res.status(201).json(rows[0][0]);
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const getPostsByType = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { type, limit, offset } = req.query;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetPostsByType(?,?,?,@totalCount)",
      [type, limit, offset]
    );
    const [[{ totalCount }]]: [any[], any] = await connection.query(
      "SELECT @totalCount as totalCount"
    );
    res.status(200).json({ posts: rows[0], totalCount });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};

export const searchPosts = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { query, limit, offset } = req.query;
  const { categorySlug } = req.params;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_SearchPosts(?,?,?,?,@totalCount)",
      [query, categorySlug, limit, offset]
    );
    const [[{ totalCount }]]: [any[], any] = await connection.query(
      "SELECT @totalCount as totalCount"
    );
    res.status(200).json({ posts: rows[0], totalCount });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};
