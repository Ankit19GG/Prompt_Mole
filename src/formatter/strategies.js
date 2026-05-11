const STRATEGIES = {
  small: {
    includeLowPriority: false,
    includeStandalone: false,
    dependencyDepth: 1,
    maxFiles: 20,
    includeCentrality: true,
  },

  medium: {
    includeLowPriority: true,
    includeStandalone: false,
    dependencyDepth: 1,
    maxFiles: 40,
    includeCentrality: true,
  },

  large: {
    includeLowPriority: true,
    includeStandalone: true,
    dependencyDepth: 2,
    maxFiles: 100,
    includeCentrality: true,
  },

  ultra: {
    includeLowPriority: true,
    includeStandalone: true,
    dependencyDepth: 3,
    maxFiles: 300,
    includeCentrality: true,
  },
};

function getStrategy(
  targetModel
) {
  return (
    STRATEGIES[targetModel] ||
    STRATEGIES.small
  );
}

module.exports = {
  getStrategy,
};