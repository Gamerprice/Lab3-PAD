const request = require("supertest");
const app = require("../index");

jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({}))
}));

describe("COMMENTS SERVICE", () => {
  it("creates a comment", async () => {
    const response = await request(app)
      .post("/posts/123/comments")
      .send({ content: "Hello!" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].content).toBe("Hello!");
  });
});