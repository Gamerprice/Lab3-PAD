const request = require("supertest");
const app = require("../index"); // экспортируй express() из index.js

describe("POSTS SERVICE", () => {
  it("creates a post", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "Test Post" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title", "Test Post");
  });
});
