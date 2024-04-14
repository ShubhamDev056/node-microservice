import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/index.js";
import routes from "./routes/index.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3003;

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", routes); // route

app.get("/", (req, res) => {
  res.json({
    message: "auth service root route",
  });
});

app.use(notFound); //not found
app.use(errorHandler); //error handler

app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});
