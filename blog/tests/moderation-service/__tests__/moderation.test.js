const { moderate } = require("../moderation");

test("prohibits bad words", () => {
  expect(moderate("orange bad")).toBe("rejected");
  expect(moderate("good comment")).toBe("approved");
});
