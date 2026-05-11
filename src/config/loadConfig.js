const fs = require("fs");
const path = require("path");

function loadConfig(rootDir) {
  const configPath = path.join(
    rootDir,
    "promptmole.config.json"
  );

  if (!fs.existsSync(configPath)) {
    return {
      premium: false,
      high: [],
      low: [],
    };
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8");

    return JSON.parse(raw);
  } catch (error) {
    console.error(
      "Failed to parse promptmole.config.json"
    );

    console.error(error.message);

    process.exit(1);
  }
}

module.exports = {
  loadConfig,
};