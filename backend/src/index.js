import express, { response } from "express";
import cors from "cors";
import connectDataBase from "./database/db.js";
import routes from "./routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({})
);

app.use(routes);

connectDataBase()
  .then(() => {
    app.listen(3000, () =>
      console.log("Servidor à rodar e Database conectado")
    );
  })
  .catch((err) => console.log(err));
