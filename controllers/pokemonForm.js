import tryCatchWrapper from "../middlewares/tryCatchWrapper.js";
import pool from "../db.js";
import { createCustomError } from "../customError.js";
/**
 * @returns note object
 */
async function getPokemonForm(id) {
  let sql = "SELECT * FROM PokemonForm WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}

/**
 * @returns note object
 */
async function getPokemonForms(ids) {
  const valPlaceholders = Array(ids.length).fill("?").join(",");
  let sql = `SELECT * FROM PokemonForm WHERE id IN (${valPlaceholders})`;
  const [rows] = await pool.query(sql, ids);
  return rows[0];
}
/**
 * @returns note object
 */
async function getPokemonFormsByGeneration(generationId) {
  let sql = `SELECT * FROM PokemonForm WHERE generationId=?`;
  const [rows] = await pool.query(sql, generationId);
  return rows;
}

/**
 * @description Get All Pokemon Forms
 * @route GET /pokemonform
 */

export const getAllPokemonForms = tryCatchWrapper(
  // eslint-disable-next-line no-unused-vars
  async function (req, res, _next) {
    let sql = "SELECT * from PokemonForm";
    const [rows] = await pool.query(sql);
    if (!rows.length) return res.status(204).json({ message: "empty list" });

    return res.status(200).json(rows);
  },
);

/**
 * @description Get Single Pokemon Forms
 * @route GET /pokemonform/:id
 */
export const getSinglePokemonForm = tryCatchWrapper(
  async function (req, res, next) {
    const { id } = req.params;

    const pokemonForm = await getPokemonForm(id);
    if (!pokemonForm)
      return next(createCustomError("Pokemon Form not found", 404));

    return res.status(200).json(pokemonForm);
  },
);
/**
 * @description Get Many Pokemon Forms
 * @route GET /pokemonform/many/:[ids]
 */
export const getManyPokemonForms = tryCatchWrapper(
  async function (req, res, next) {
    const { ids } = req.params;

    const array = ids.split(",");

    const pokemonForms = await getPokemonForms(array);
    if (!pokemonForms)
      return next(createCustomError("Pokemon Forms not found", 404));

    return res.status(200).json(pokemonForms);
  },
);

/**
 * @description Get Many Pokemon Forms by Generation Id
 * @route GET /pokemonform/generation/:id
 */
export const getManyPokemonFormsByGenerationId = tryCatchWrapper(
  async function (req, res, next) {
    const { generationId } = req.params;

    const pokemonForms = await getPokemonFormsByGeneration(generationId);
    if (!pokemonForms)
      return next(
        createCustomError(
          "Pokemon Forms from generation id: " + generationId + " not found",
          404,
        ),
      );

    return res.status(200).json(pokemonForms);
  },
);
