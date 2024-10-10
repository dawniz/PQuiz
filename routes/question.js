import express from "express";
import { getQuestions } from "../controllers/question.js";

const router = express.Router();

router.route("/:count/:type/:generationId").get(getQuestions);

export default router;
