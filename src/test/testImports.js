const fs = require("fs");
const path = require("path");

const { extractImports } = require("../parser/extractImports");

const content = fs.readFileSync(
  path.join(__dirname, "sample.js"),
  "utf-8"
);

const imports = extractImports(content);

console.log(JSON.stringify(imports, null, 2));