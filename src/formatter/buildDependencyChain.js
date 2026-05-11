function buildDependencyChain(
  filePath,
  graph,
  depth,
  visited = new Set()
) {
  if (
    depth === 0 ||
    visited.has(filePath)
  ) {
    return "";
  }

  visited.add(filePath);

  const dependencies =
    graph[filePath] || [];

  if (
    dependencies.length === 0
  ) {
    return "";
  }

  return dependencies
    .map(dep => {
      const nested =
        buildDependencyChain(
          dep,
          graph,
          depth - 1,
          visited
        );

      if (nested) {
        return `${dep} -> (${nested})`;
      }

      return dep;
    })
    .join(", ");
}

module.exports = {
  buildDependencyChain,
};