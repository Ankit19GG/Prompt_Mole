const { getStrategy } = require("./strategies");
const { buildDependencyChain } = require("./buildDependencyChain");

function buildPrompt(data) {
  const {
    techStack,
    files,
  } = data;

  const strategy =
    getStrategy(
      data.targetModel ||
      "small"
    );

  const stackString =
    buildStackString(techStack);

  const highPriority =
        buildPrioritySection(
            files,
            "high",
            data.graph,
            strategy
        );

  const normalPriority =
    buildPrioritySection(
      files,
      "normal",
      data.graph,
      strategy
    );

  const lowPriority =
    buildPrioritySection(
      files,
      "low",
      data.graph,
      strategy
    );

  return `
You are helping with an existing software project.

Below is compressed repository context.

Syntax Rules:
A->B,C,D means file A depends on B,C,D.

Your task:
- Understand architecture
- Infer relationships
- Identify business logic
- Identify shared utilities
- Identify routing structure
- Infer ownership boundaries

Stack:
${stackString}

High Priority:
${highPriority}

Normal Priority:
${normalPriority}

Low Priority:
${lowPriority}

If anything is unclear, ask concise clarification questions.
`;
}

function buildStackString(
  techStack
) {
  techStack = techStack || {};
  const parts = [];

  if (techStack.framework) {
    parts.push(
      techStack.framework
    );
  }

  if (techStack.language) {
    parts.push(
      techStack.language
    );
  }

  parts.push(
    ...(techStack.database || [])
  );

  parts.push(
    ...(techStack.orm || [])
  );

  parts.push(
    ...(techStack.styling || [])
  );

  parts.push(
    ...(techStack.stateManagement || [])
  );

  return parts.join(", ");
}

function buildPrioritySection(
  files,
  priority,
  graph,
  strategy
) {
  let filtered = files.filter(
    file =>
      file.priority === priority
  );

  if (
    !strategy.includeStandalone
  ) {
    filtered = filtered.filter(
      file =>
        file.imports.length > 0
    );
  }

  filtered.sort(
    (a, b) =>
      b.centrality -
      a.centrality
  );

  filtered = filtered.slice(
    0,
    strategy.maxFiles
  );

  return filtered
    .map(file => {
      const dependencyChain =
        buildDependencyChain(
          file.path,
          graph,
          strategy.dependencyDepth
        );

      const centralityValue = Number(file.centrality) || 0;
      const centralityLabel =
        strategy && strategy.includeCentrality && centralityValue > 0
          ? ` [centrality: ${centralityValue}]`
          : "";

      if (!dependencyChain) {
        return `${file.path}${centralityLabel}`;
      }

      return `${file.path}${centralityLabel}->${dependencyChain}`;
    })
    .join(";\n");
}

module.exports = {
  buildPrompt,
};
