import express from "express";
import {
  getAllGenerations,
  getSingleGeneration,
} from "../controllers/generation.js";

const router = express.Router();

router.route("/").get(getAllGenerations);
router.route("/:id").get(getSingleGeneration);

export default router;
