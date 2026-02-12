import { Router } from "express";
import movieController from "../controllers/movie.controller.js";

const router = Router();

router.get("/movies", movieController.list);
router.get("/movies/:id", movieController.detail);
router.post("/movies", movieController.create);
router.patch("/movies/:id", movieController.update);
router.delete("/movies/:id", movieController.delete);

export default router;
