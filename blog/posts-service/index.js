const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const posts = {};

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  await axios.post("http://event-bus:4005/events", {
    type: "PostCreated",
    data: { id, title }
  });

  res.status(201).send(posts[id]);
});

module.exports = app;

// ⬇️ сервер стартует ТОЛЬКО если не тест
if (require.main === module) {
  app.listen(4000, () => {
    console.log("Posts service listening on 4000");
  });
}