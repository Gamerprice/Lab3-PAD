function moderate(content) {
  if (content.includes("orange")) {
    return "rejected";
  }

  return "approved";
}

module.exports = { moderate };