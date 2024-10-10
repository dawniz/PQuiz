import express from "express";
import {
  getAllPokemonForms,
  getManyPokemonForms,
  getManyPokemonFormsByGenerationId,
  getSinglePokemonForm,
} from "../controllers/pokemonForm.js";

const router = express.Router();

router.route("/").get(getAllPokemonForms);
router.route("/:id").get(getSinglePokemonForm);
router.route("/:ids").get(getManyPokemonForms);
router.route("/generation/:id").get(getManyPokemonFormsByGenerationId);

export default router;
