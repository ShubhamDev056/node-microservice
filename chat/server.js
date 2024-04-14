import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(morgan());

app.get("/", (req, res) => {
  res.send("Res from chat service");
});

app.get("/users", (req, res) => {
  res.json({
    name: "John",
    email: "john@email.com",
  });
});

// Handler for route-not-found
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
});

// Define port for Express server
const PORT = process.env.PORT || 5000;

// Start Express server
app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
