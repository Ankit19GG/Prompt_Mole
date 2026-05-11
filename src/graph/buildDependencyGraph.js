function buildDependencyGraph(
  files
) {
  const graph = {};

  files.forEach(file => {
    const dependencies =
      file.imports
        .filter(
          imp => imp.resolved
        )
        .map(
          imp => imp.resolved
        );

    graph[file.path] =
      dependencies;
  });

  return graph;
}

module.exports = {
  buildDependencyGraph,
};