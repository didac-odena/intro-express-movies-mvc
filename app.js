import express from "express";
import morgan from "morgan";
import router from "./config/routes.config.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(router);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

export default app;
