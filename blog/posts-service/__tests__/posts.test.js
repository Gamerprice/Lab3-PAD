const request = require("supertest");
const app = require("../index");

// 🔴 ВАЖНО: мок axios
jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({}))
}));

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