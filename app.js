import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import "./config/db.config.js";
import router from "./config/routes.config.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(router);

// Catch-all 404 para rutas no definidas
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Middleware centralizado de errores
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

export default app;
