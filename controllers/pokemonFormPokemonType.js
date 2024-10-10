import tryCatchWrapper from "../middlewares/tryCatchWrapper.js";
import pool from "../db.js";
import { createCustomError } from "../customError.js";
/**
 * @returns note object
 */
async function getPokemonFormPokemonType(formId) {
  let sql =
    "SELECT PokemonType.name FROM PokemonType INNER JOIN PokemonFormPokemonType ON PokemonFormPokemonType.pokemonTypeId=PokemonType.id WHERE PokemonFormPokemonType.pokemonFormId = ?";
  const [rows] = await pool.query(sql, [formId]);
  return rows;
}

/**
 * @description Get Pokemon Types of Pokemon Form
 * @route GET /pokemonformpokemontype/:id
 */
export const getTypesOfPokemonForm = tryCatchWrapper(
  async function (req, res, next) {
    const { formId } = req.params;

    const types = await getPokemonFormPokemonType(formId);
    if (!types)
      return next(
        createCustomError("PokemonFormPokemonType relation not found", 404),
      );

    return res.status(200).json(types);
  },
);

export const getPokemonTypesOfPokemonFormForApp = async (formId) => {
  const types = await getPokemonFormPokemonType(formId);
  return types;
};
