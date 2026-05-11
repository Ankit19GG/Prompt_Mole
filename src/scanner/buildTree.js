function buildTree(files) {
  const tree = {};

  files.forEach(file => {
    const parts = file.path.split("/");

    let current = tree;

    parts.forEach(part => {
      if (!current[part]) {
        current[part] = {};
      }

      current = current[part];
    });
  });

  return tree;
}

module.exports = {
  buildTree,
};