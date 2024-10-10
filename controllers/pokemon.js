import tryCatchWrapper from "../middlewares/tryCatchWrapper.js";
import pool from "../db.js";
import { createCustomError } from "../customError.js";
/**
 * @returns note object
 */
async function getPokemon(id) {
  let sql = "SELECT * FROM Pokemon WHERE id=?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}
async function getManyPokemonsDb(ids) {
  const valPlaceholders = Array(ids.length).fill("?").join(",");
  let sql = `SELECT * FROM Pokemon WHERE id IN (${valPlaceholders})`;
  const [rows] = await pool.query(sql, ids);
  return rows[0];
}
/**
 * @description Get All Pokemons
 * @route GET /pokemon
 */
// eslint-disable-next-line no-unused-vars
export const getAllPokemons = tryCatchWrapper(async function (req, res, _next) {
  let sql = "SELECT * from Pokemon";
  const [rows] = await pool.query(sql);
  if (!rows.length) return res.status(204).json({ message: "empty list" });

  return res.status(200).json(rows);
});

/**
 * @description Get Single Pokemon
 * @route GET /pokemon/:id
 */
export const getSinglePokemon = tryCatchWrapper(
  async function (req, res, next) {
    const { id } = req.params;

    const pokemon = await getPokemon(id);
    if (!pokemon) return next(createCustomError("Pokemon not found", 404));

    return res.status(200).json(pokemon);
  },
);

export const getSinglePokemonForApp = async (id) => {
  const pokemon = await getPokemon(id);
  return pokemon;
};
/**
 * @description Get many Pokemon
 * @route GET /pokemon/many/:ids
 */

export const getManyPokemons = tryCatchWrapper(async function (req, res, next) {
  const { ids } = req.params;

  const array = ids.split(",");

  const pokemons = await getManyPokemonsDb(array);
  if (!pokemons) return next(createCustomError("Pokemons not found", 404));

  return res.status(200).json(pokemons);
});
