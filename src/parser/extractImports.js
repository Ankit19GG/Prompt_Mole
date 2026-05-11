const IMPORT_REGEX =
  /import\s+(?:.+?\s+from\s+)?["'](.+?)["']/g;

const REQUIRE_REGEX =
  /require\(["'](.+?)["']\)/g;

const DYNAMIC_IMPORT_REGEX =
  /import\(["'](.+?)["']\)/g;

function isLocalImport(importPath) {
  return (
    importPath.startsWith(".") ||
    importPath.startsWith("/") ||
    importPath.startsWith("@/")
  );
}

function extractImports(content) {
  const imports = [];

  let match;

  while ((match = IMPORT_REGEX.exec(content))) {
    imports.push({
      type: "import",
      value: match[1],
      local: isLocalImport(match[1]),
    });
  }

  while ((match = REQUIRE_REGEX.exec(content))) {
    imports.push({
      type: "require",
      value: match[1],
      local: isLocalImport(match[1]),
    });
  }

  while ((match = DYNAMIC_IMPORT_REGEX.exec(content))) {
    imports.push({
      type: "dynamic-import",
      value: match[1],
      local: isLocalImport(match[1]),
    });
  }

  return imports;
}

module.exports = {
  extractImports,
};