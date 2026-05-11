const fs = require("fs");
const path = require("path");

const { normalizePath } = require("../util/normalizePath");

const POSSIBLE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
];

function resolveImport(
  currentFile,
  importPath,
  rootDir
) {
  if (
    !importPath.startsWith(".") &&
    !importPath.startsWith("@/")
  ) {
    return null;
  }

  let resolvedPath;

  if (importPath.startsWith(".")) {
    resolvedPath = path.resolve(
      path.dirname(currentFile),
      importPath
    );
  } else if (
    importPath.startsWith("@/")
  ) {
    resolvedPath = path.join(
      rootDir,
      "src",
      importPath.replace("@/", "")
    );
  }

  const finalPath =
    findExistingFile(
      resolvedPath
    );

  if (!finalPath) {
    return null;
  }

  return normalizePath(
    path.relative(
      rootDir,
      finalPath
    )
  );
}

function findExistingFile(
  basePath
) {
  if (
    fs.existsSync(basePath)
  ) {
    return basePath;
  }

  for (const ext of POSSIBLE_EXTENSIONS) {
    const fullPath =
      basePath + ext;

    if (
      fs.existsSync(fullPath)
    ) {
      return fullPath;
    }
  }

  for (const ext of POSSIBLE_EXTENSIONS) {
    const indexPath =
      path.join(
        basePath,
        `index${ext}`
      );

    if (
      fs.existsSync(indexPath)
    ) {
      return indexPath;
    }
  }

  return null;
}

module.exports = {
  resolveImport,
};