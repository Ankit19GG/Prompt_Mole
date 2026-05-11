function calculateCentrality(
  reverseGraph
) {
  const scores = {};

  for (const file in reverseGraph) {
    scores[file] =
      reverseGraph[file].length;
  }

  return scores;
}

module.exports = {
  calculateCentrality,
};