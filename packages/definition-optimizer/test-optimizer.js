#!/usr/bin/env node

import { optimizeToolDefinition } from "./dist/index.js";

const sampleToolDefinition = {
  tools: [
    {
      name: "write_file",
      description:
        "Create a new file or completely overwrite an existing file with new content.",
      inputSchema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "The path to the file to write to",
          },
          content: {
            type: "string",
            description: "The content to write to the file",
          },
        },
        required: ["file_path", "content"],
      },
    },
  ],
};

const testOptimizer = async () => {
  try {
    // Make sure to set environment variables for at least one provider:
    // OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY

    console.log("Starting optimization process...");
    console.log(
      "Original description:",
      sampleToolDefinition.tools[0].description
    );

    const optimizedToolDefinition = await optimizeToolDefinition(
      sampleToolDefinition,
      "anthropic", // target provider
      "model-based", // optimization strategy
      "claude-3-7-sonnet-20250219" // model to use
    );

    console.log("Optimization completed!");
    console.log(
      "Optimized description:",
      optimizedToolDefinition.tools[0].description
    );

    // Compare original vs optimized
    console.log("\nComparison:");
    console.log("Original:", sampleToolDefinition.tools[0].description);
    console.log("Optimized:", optimizedToolDefinition.tools[0].description);
  } catch (error) {
    console.error("Error during optimization:", error);
  }
};

testOptimizer();
