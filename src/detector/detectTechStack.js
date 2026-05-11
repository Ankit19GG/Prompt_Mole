const fs = require("fs");
const path = require("path");

function detectTechStack(rootDir) {
  try {
    const packagePath = path.join(
      rootDir,
      "package.json"
    );

    if (!fs.existsSync(packagePath)) {
      return {};
    }

    const pkg = JSON.parse(
      fs.readFileSync(packagePath, "utf-8")
    );

    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    return analyzeDependencies(
      dependencies,
      rootDir
    );
  } catch (error) {
    return {};
  }
}

function analyzeDependencies(
  dependencies,
  rootDir
) {
  const stack = {
    framework: null,
    language: null,
    database: [],
    orm: [],
    styling: [],
    stateManagement: [],
    backend: [],
    testing: [],
  };

  if (dependencies.next) {
    stack.framework = "Next.js";
  } else if (dependencies.react) {
    stack.framework = "React";
  }

  if (dependencies.typescript) {
    stack.language = "TypeScript";
  } else {
    stack.language = "JavaScript";
  }

  if (dependencies["@prisma/client"]) {
    stack.orm.push("Prisma");
  }

  if (dependencies.mongoose) {
    stack.orm.push("Mongoose");
  }

  if (dependencies.pg) {
    stack.database.push("PostgreSQL");
  }

  if (dependencies.mongodb) {
    stack.database.push("MongoDB");
  }

  if (dependencies.tailwindcss) {
    stack.styling.push("Tailwind CSS");
  }

  if (dependencies.sass) {
    stack.styling.push("SASS");
  }

  if (dependencies.zustand) {
    stack.stateManagement.push("Zustand");
  }

  if (dependencies["@reduxjs/toolkit"]) {
    stack.stateManagement.push(
      "Redux Toolkit"
    );
  }

  if (dependencies.express) {
    stack.backend.push("Express");
  }

  if (dependencies.jest) {
    stack.testing.push("Jest");
  }

  if (dependencies.vitest) {
    stack.testing.push("Vitest");
  }

  return stack;
}

module.exports = {
  detectTechStack,
};