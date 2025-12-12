const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// ===== GET POSTS =====
app.get("/posts", (req, res) => {
  res.send(posts);
});

// ===== CREATE POST =====
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

// ===== HANDLE EVENTS =====
app.post("/events", (req, res) => {
  console.log("Received Event:", req.body.type);
  res.send({});
});

// ===== EXPORT FOR TESTS =====
module.exports = app;

// ===== RUN SERVER ONLY WHEN EXECUTED DIRECTLY =====
if (require.main === module) {
  app.listen(4000, () => {
    console.log("Posts service listening on 4000");
  });
}
