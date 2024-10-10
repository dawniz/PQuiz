import tryCatchWrapper from "../middlewares/tryCatchWrapper.js";
import pool from "../db.js";
import { createCustomError } from "../customError.js";
/**
 * @returns note object
 */
async function getPokemonType(id) {
  let sql = "SELECT * FROM PokemonType WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}
/**
 * @description Get All Pokemon Types
 * @route GET /pokemontype
 */

export const getAllPokemonTypes = tryCatchWrapper(
  // eslint-disable-next-line no-unused-vars
  async function (req, res, _next) {
    let sql = "SELECT * from PokemonType WHERE disabled=?";
    const [rows] = await pool.query(sql, false);
    if (!rows.length) return res.status(204).json({ message: "empty list" });

    return res.status(200).json(rows);
  },
);

/**
 * @description Get Single Pokemon Type
 * @route GET /pokemontype/:id
 */
export const getSinglePokemonType = tryCatchWrapper(
  async function (req, res, next) {
    const { id } = req.params;

    const pokemonType = await getPokemonType(id);
    if (!pokemonType)
      return next(createCustomError("Pokemon Type not found", 404));

    return res.status(200).json(pokemonType);
  },
);
