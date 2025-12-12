const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// ===== EVENT HANDLER =====
app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange")
      ? "rejected"
      : "approved";

    // IMPORTANT: use Docker service name, not localhost
    await axios.post("http://event-bus:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  res.send({});
});

// ===== Export for tests =====
module.exports = app;

// ===== Run only when executed directly =====
if (require.main === module) {
  app.listen(4003, () => {
    console.log("Moderation service listening on 4003");
  });
}
