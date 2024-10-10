import express from "express";
import {
  getAllPokemonTypes,
  getSinglePokemonType,
} from "../controllers/pokemonType.js";

const router = express.Router();

router.route("/").get(getAllPokemonTypes);
router.route("/:id").get(getSinglePokemonType);

export default router;
