const fs = require("fs");
const path = require("path");
const { normalizePath } = require("../util/normalizePath");

const { shouldIgnore } = require("./ignore");

function scanFiles(rootDir, options = {}) {
  const results = [];

  const validExtensions =
    options.extensions && options.extensions.length > 0
      ? options.extensions
      : [".js", ".jsx", ".ts", ".tsx"];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);

      if (shouldIgnore(fullPath)) {
        continue;
      }

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = path.extname(fullPath);

        if (validExtensions.includes(ext)) {
          results.push({
            name: path.basename(fullPath),
            path: normalizePath(
                            path.relative(rootDir, fullPath)
                    ),
            ext,
            size: stat.size,
          });
        }
      }
    }
  }

  walk(rootDir);

  return results;
}

module.exports = {
  scanFiles,
};