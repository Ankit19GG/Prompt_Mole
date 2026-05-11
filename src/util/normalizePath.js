function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/");
}

module.exports = {
  normalizePath,
};