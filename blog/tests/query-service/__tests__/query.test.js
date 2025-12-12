const request = require("supertest");
const app = require("../index");

test("returns aggregated posts", async () => {
  const response = await request(app).get("/posts");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});
