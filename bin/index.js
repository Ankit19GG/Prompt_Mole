#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { buildPrompt } = require("../src/formatter/buildPrompt");
const { detectTechStack } = require("../src/detector/detectTechStack");
const { analyzeFiles } = require("../src/analyzer/analyzeFiles");
const { loadConfig } = require("../src/config/loadConfig");
const { buildDependencyGraph } = require("../src/graph/buildDependencyGraph");
const { buildReverseGraph } = require("../src/graph/buildReverseGraph");
const { calculateCentrality } = require("../src/graph/calculateCentrality");

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    extensions: [],
    json: false,
    output: null,
    model: null,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--ext" && args[i + 1]) {
      options.extensions = args[i + 1].split(",");
      i++;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--output" && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (arg === "--model" && args[i + 1]) {
      options.model = args[i + 1];
      i++;
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return options;
}

function printHelp() {
  console.log(`
Usage: promptmole [options]

Options:
  --ext <exts>    Comma-separated list of extensions (default: .js,.jsx,.ts,.tsx)
  --json          Output results as JSON
  --output <file> Save output to a file
  --model <name>  Specify target model for optimization (small, medium, large)
  --verbose       Enable verbose logging
  --help, -h      Show help
`);
}

function main() {
  try {
    const options = parseArgs();
    const root = process.cwd();

    if (options.verbose) console.error("🚀 Starting Prompt Mole analysis...");

    const config = loadConfig(root);
    const techStack = detectTechStack(root);

    if (options.verbose) console.error("🔍 Scanning files...");
    const analyzedFiles = analyzeFiles(root, options, config);

    if (options.verbose) console.error("📊 Building dependency graph...");
    const dependencyGraph = buildDependencyGraph(analyzedFiles);

    const reverseGraph = buildReverseGraph(dependencyGraph);
    const centralityScores = calculateCentrality(reverseGraph);

    const enrichedFiles = analyzedFiles.map(file => ({
      ...file,
      centrality: centralityScores[file.path] || 0,
    }));


    if (options.verbose) console.error("📝 Formatting prompt...");
    const prompt = buildPrompt({
      techStack,
      files: enrichedFiles,
      graph: dependencyGraph,
      reverseGraph,
      targetModel: options.model || config.targetModel || "small",
    });

    // Token estimation (rough: 1 token ≈ 4 characters)
    const estimatedTokens = Math.ceil(prompt.length / 4);

    if (options.json) {
      const output = {
        techStack,
        estimatedTokens,
        files: enrichedFiles,
        tree,
        prompt,
      };
      const jsonOutput = JSON.stringify(output, null, 2);
      if (options.output) {
        fs.writeFileSync(options.output, jsonOutput);
        console.error(`✅ JSON output written to ${options.output}`);
      } else {
        console.log(jsonOutput);
      }
    } else {
      if (options.output) {
        fs.writeFileSync(options.output, prompt);
        console.error(`✅ Prompt written to ${options.output}`);
        console.error(`Estimated Tokens: ${estimatedTokens}`);
      } else {
        console.log(prompt);
        console.error(`\n---\n✨ Estimated Tokens: ${estimatedTokens}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (process.env.DEBUG) console.error(error.stack);
    process.exit(1);
  }
}

main();