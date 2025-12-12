const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];

    if (post) {
      post.comments.push({ id, content, status });
    }
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    if (!post) return;

    const comment = post.comments.find((c) => c.id === id);
    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

// ===== EXPORT FOR TESTS =====
module.exports = app;

// ===== ONLY START SERVER WHEN EXECUTED DIRECTLY =====
if (require.main === module) {
  app.listen(4002, async () => {
    console.log("Query service listening on 4002");

    try {
      // IMPORTANT: Use Docker service name, NOT localhost
      const res = await axios.get("http://event-bus:4005/events");

      for (let event of res.data) {
        console.log("Replaying event:", event.type);
        handleEvent(event.type, event.data);
      }
    } catch (err) {
      console.log("Replay error:", err.message);
    }
  });
}
