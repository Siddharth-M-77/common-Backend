import express from "express";

const app = express();

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(PORT, () => {
  console.log(`server is running on the PORT: ${PORT} !!!`);
});
