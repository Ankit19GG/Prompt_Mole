# Prompt Mole 🚀

Prompt Mole is a powerful CLI tool that scans your codebase, analyzes dependencies, and generates a model-aware compressed prompt for use with LLMs.

## Features

- 📂 **Filesystem Scanning**: Automatically detects relevant files in your project.
- 📦 **Import Extraction & Resolution**: Maps out how your files interact.
- 📊 **Dependency Graphing**: Builds a full graph of your project's architecture.
- 🎯 **Centrality Scoring**: Identifies the most important files based on how often they are imported.
- 🛠️ **Tech Stack Detection**: Automatically recognizes frameworks (Next.js, Vite, etc.).
- 📉 **Model-Aware Compression**: Optimizes the prompt based on your target model's context window.
- 🏷️ **Token Awareness**: Provides estimated token counts for generated prompts.
- 🚫 **Ignore Support**: Respects `.promptmoleignore` files.

## Installation

```bash
npm install -g promptmole
```

Or run directly using npx:

```bash
npx promptmole
```

## Usage

Run it in your project root:

```bash
promptmole
```

### Options

- `--ext <exts>`: Comma-separated list of extensions (default: `.js,.jsx,.ts,.tsx`).
- `--json`: Output the entire analysis (tree, graph, scores) as JSON.
- `--output <file>`: Save the generated prompt or JSON to a file.
- `--model <name>`: Target model size (`small`, `medium`, `large`).
- `--verbose`: Show detailed processing logs.

### Example

```bash
promptmole --model large --output context.txt
```

## Configuration

You can also use a `promptmole.config.json` file in your root:

```json
{
  "targetModel": "large",
  "priority": {
    "src/lib/**": 5,
    "src/components/**": 3
  }
}
```

## .promptmoleignore

Create a `.promptmoleignore` file to exclude specific directories or files from the scan:

```text
node_modules
dist
.next
*.log
```

## Why Prompt Mole?

Traditional "copy-paste everything" approaches waste tokens and confuse LLMs. Prompt Mole uses graph theory and priority analysis to ensure the most critical context is provided first, while stripping away noise.
