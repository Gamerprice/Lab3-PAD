const request = require("supertest");
const app = require("../index");

test("accepts events", async () => {
  const response = await request(app).post("/events").send({
    type: "TestEvent",
    data: { ok: true }
  });

  expect(response.statusCode).toBe(200);
});
