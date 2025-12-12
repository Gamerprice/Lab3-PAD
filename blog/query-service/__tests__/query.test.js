const request = require("supertest");
const app = require("../index");

describe("QUERY SERVICE", () => {
  it("returns aggregated posts", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe("object");
  });
});