import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(morgan());

app.get("/", (req, res) => {
  res.send("Res from feed service");
});

app.get("/all-feeds", (req, res) => {
  res.send([
    {
      title: "all",
      description: "All Feeds",
    },
    {
      title: "all",
      description: "All Feeds",
    },
    {
      title: "all",
      description: "All Feeds",
    },
  ]);
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
