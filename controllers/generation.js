import tryCatchWrapper from "../middlewares/tryCatchWrapper.js";
import pool from "../db.js";
import { createCustomError } from "../customError.js";

/**
 * @returns note object
 */
async function getGeneration(id) {
  let sql = "SELECT * FROM Generation WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}
/**
 * @description Get All Generations
 * @route GET /generation
 */

export const getAllGenerations = tryCatchWrapper(
  // eslint-disable-next-line no-unused-vars
  async function (req, res, _next) {
    let sql = "SELECT * from Generation";
    const [rows] = await pool.query(sql);
    if (!rows.length) return res.status(204).json({ message: "empty list" });

    return res.status(200).json(rows);
  },
);

/**
 * @description Get Single Generation
 * @route GET /generation/:id
 */

export const getSingleGeneration = tryCatchWrapper(
  async function (req, res, next) {
    const { id } = req.params;

    const generation = await getGeneration(id);

    if (!generation)
      return next(createCustomError("Generation not found", 404));

    return res.status(200).json(generation);
  },
);
