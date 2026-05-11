const fs = require("fs");
const path = require("path");

const { scanFiles } = require("../scanner/scanFiles");
const { extractImports } = require("../parser/extractImports");
const { classifyPriority } = require("./classifyPriority");
const { resolveImport } = require("../resolver/resolveImport");

function analyzeFiles(
  rootDir,
  options = {},
  config = {}
) {
  const scannedFiles = scanFiles(rootDir, options);

  const analyzed = scannedFiles.map(file => {
    try {
      const absolutePath = path.join(rootDir, file.path);
      const content = fs.readFileSync(absolutePath, "utf-8");

      const imports =
        extractImports(content).map(
          imp => ({
            ...imp,
            resolved:
              resolveImport(
                absolutePath,
                imp.value,
                rootDir
              ),
          })
        );

      return {
        ...file,
        priority: classifyPriority(
          file.path,
          config
        ),
        imports,
      };
    } catch (error) {
      if (options.verbose) {
        console.error(`⚠️ Warning: Could not analyze ${file.path}: ${error.message}`);
      }
      return {
        ...file,
        priority: "low",
        imports: [],
      };
    }
  });

  return analyzed;
}

module.exports = {
  analyzeFiles,
};