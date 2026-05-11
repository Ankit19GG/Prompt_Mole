function classifyPriority(filePath, config) {
  const high = config.high || [];
  const low = config.low || [];

  if (
    high.some(pattern =>
      filePath.includes(pattern)
    )
  ) {
    return "high";
  }

  if (
    low.some(pattern =>
      filePath.includes(pattern)
    )
  ) {
    return "low";
  }

  return "normal";
}

module.exports = {
  classifyPriority,
};