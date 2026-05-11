const fs = require("fs");
const path = require("path");

const DEFAULT_IGNORES = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml"
];

let customIgnores = [];
try {
  const ignoreFilePath = path.join(process.cwd(), ".promptmoleignore");
  if (fs.existsSync(ignoreFilePath)) {
    customIgnores = fs.readFileSync(ignoreFilePath, "utf-8")
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));
  }
} catch (error) {
  // Ignore errors reading ignore file
}

const allIgnores = [...DEFAULT_IGNORES, ...customIgnores];

function shouldIgnore(filePath) {
  return allIgnores.some(ignore =>
    filePath.includes(ignore)
  );
}

module.exports = {
  shouldIgnore,
  DEFAULT_IGNORES: allIgnores
};