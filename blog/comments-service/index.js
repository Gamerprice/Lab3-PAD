const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// ===== GET COMMENTS =====
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// ===== CREATE COMMENT =====
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  // IMPORTANT: use service name in Docker Compose
  await axios.post("http://event-bus:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

// ===== RECEIVE EVENTS =====
app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post("http://event-bus:4005/events", {
      type: "CommentUpdated",
      data: { id, status, postId, content },
    });
  }

  res.send({});
});

// ===== EXPORT FOR TESTS =====
module.exports = app;

// ===== START ONLY IF RUN DIRECTLY =====
if (require.main === module) {
  app.listen(4001, () => {
    console.log("Comments service listening on 4001");
  });
}
