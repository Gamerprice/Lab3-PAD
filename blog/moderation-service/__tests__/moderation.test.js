const { moderate } = require("../moderation");

test("prohibits bad words", () => {
  expect(moderate("orange bad")).toBe("rejected");
});

test("allows clean content", () => {
  expect(moderate("hello world")).toBe("approved");
});