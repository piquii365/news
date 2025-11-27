import conn from "../config/db.config.js";
import express from "express";
import { handleError } from "../utils/error.util.ts";

export const getOverviewStats = async (
  req: express.Request,
  res: express.Response
) => {
  const connection = await conn.getConnection();
  const { daysBack } = req.query;
  try {
    const [rows]: [rows: any[], any] = await connection.query(
      "CALL sp_GetOverview(?)",
      [daysBack || 20]
    );
    // Extract data from the rows array
    const overviewStats = rows[0][0];
    const timePeriods = rows[1];
    const topPosts = rows[2];
    const categoryPerformance = rows[3];
    const authorPerformance = rows[4];

    res.status(200).json({
      overviewStats,
      timePeriods,
      topPosts,
      categoryPerformance,
      authorPerformance,
    });
  } catch (error) {
    handleError(res, error);
  } finally {
    connection.release();
  }
};
