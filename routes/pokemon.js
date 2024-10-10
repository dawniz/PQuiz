import express from "express";
import {
  getSinglePokemon,
  getManyPokemons,
  getAllPokemons,
} from "../controllers/pokemon.js";

const router = express.Router();

router.route("/pokemon/:id").get(getSinglePokemon);
router.route("/:id").get(getAllPokemons);
router.route("pokemon/many/:ids").get(getManyPokemons);

export default router;
