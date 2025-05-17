#!/usr/bin/env node

import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { optimizeToolDefinition } from "@umuthopeyildirim/mcp-tool-definition-optimizer";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Define paths
const outputDir = path.join(rootDir, "dist");
const outputFile = path.join(outputDir, "optimized-tools.js");

// Make sure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// The original tool definitions - simplified for ESM compatibility
const originalToolDefinitions = {
  tools: [
    {
      name: "read_file",
      description:
        "Read the complete contents of a file from the file system. " +
        "Handles various text encodings and provides detailed error messages " +
        "if the file cannot be read. Use this tool when you need to examine " +
        "the contents of a single file. Only works within allowed directories.",
      inputSchema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "Path to the file to read",
          },
        },
        required: ["file_path"],
      },
    },
    {
      name: "write_file",
      description:
        "Create a new file or completely overwrite an existing file with new content. " +
        "Use with caution as it will overwrite existing files without warning. " +
        "Handles text content with proper encoding. Only works within allowed directories.",
      inputSchema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "Path where the file should be written",
          },
          content: {
            type: "string",
            description: "Content to write to the file",
          },
        },
        required: ["file_path", "content"],
      },
    },
    {
      name: "list_directory",
      description:
        "Get a detailed listing of all files and directories in a specified path. " +
        "Results clearly distinguish between files and directories with [FILE] and [DIR] " +
        "prefixes. This tool is essential for understanding directory structure and " +
        "finding specific files within a directory. Only works within allowed directories.",
      inputSchema: {
        type: "object",
        properties: {
          directory_path: {
            type: "string",
            description: "Path to the directory to list",
          },
        },
        required: ["directory_path"],
      },
    },
    {
      name: "list_allowed_directories",
      description:
        "Returns the list of directories that this server is allowed to access. " +
        "Use this to understand which directories are available before trying to access files.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
};

async function optimizeAndGenerate() {
  try {
    console.log("Starting tool definition optimization...");

    // Optimize the tools
    const optimizedTools = await optimizeToolDefinition(
      originalToolDefinitions,
      "anthropic",
      "model-based",
      "claude-3-7-sonnet-20250219"
    );

    // Generate JavaScript code
    const jsCode = `// Auto-generated file - DO NOT EDIT MANUALLY
// Generated using tool definition optimizer

export const optimizedToolDefinitions = ${JSON.stringify(optimizedTools, null, 2)};
`;

    // Write the file
    fs.writeFileSync(outputFile, jsCode);
    console.log(`Optimized tool definitions written to ${outputFile}`);
  } catch (error) {
    console.error("Error optimizing tool definitions:", error);
    process.exit(1);
  }
}

optimizeAndGenerate();
