function buildReverseGraph(
  dependencyGraph
) {
  const reverseGraph = {};

  for (const file in dependencyGraph) {
    const dependencies =
      dependencyGraph[file];

    // Ensure node exists
    if (!reverseGraph[file]) {
      reverseGraph[file] = [];
    }

    dependencies.forEach(dep => {
      if (!reverseGraph[dep]) {
        reverseGraph[dep] = [];
      }

      reverseGraph[dep].push(
        file
      );
    });
  }

  return reverseGraph;
}

module.exports = {
  buildReverseGraph,
};