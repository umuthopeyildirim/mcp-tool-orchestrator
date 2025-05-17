#!/usr/bin/env node

import { ToolDefinitions } from "./types.js";
import {
  checkApiKeys,
  validateToolDefinitions,
  generateHash,
} from "./utils.js";
import { optimizer } from "./optimizer.js";
import fs from "fs";
import path from "path";
import os from "os";

// Cache directory for storing optimized tool definitions
const CACHE_DIR = path.join(os.homedir(), ".mcp-tool-optimizer", "cache");

// Create cache directory if it doesn't exist
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Load a cached tool definition if available
 * @param hash The hash of the original tool definition
 * @param target The target provider
 * @returns The cached tool definition or null if not found
 */
const loadFromCache = (
  hash: string,
  target: string
): ToolDefinitions | null => {
  const cacheFile = path.join(CACHE_DIR, `${hash}-${target}.json`);

  try {
    if (fs.existsSync(cacheFile)) {
      const cacheStats = fs.statSync(cacheFile);
      const cacheAge = Date.now() - cacheStats.mtimeMs;

      // Consider cache valid for 7 days
      const CACHE_VALIDITY = 7 * 24 * 60 * 60 * 1000;

      if (cacheAge < CACHE_VALIDITY) {
        console.log("Loading optimized tool definition from cache");
        const cachedData = fs.readFileSync(cacheFile, "utf8");
        return JSON.parse(cachedData);
      } else {
        console.log("Cache expired, generating new optimization");
      }
    }
  } catch (error) {
    console.warn("Error reading cache:", error);
  }

  return null;
};

/**
 * Save a tool definition to the cache
 * @param hash The hash of the original tool definition
 * @param target The target provider
 * @param optimizedDef The optimized tool definition
 */
const saveToCache = (
  hash: string,
  target: string,
  optimizedDef: ToolDefinitions
): void => {
  const cacheFile = path.join(CACHE_DIR, `${hash}-${target}.json`);

  try {
    fs.writeFileSync(cacheFile, JSON.stringify(optimizedDef, null, 2));
    console.log("Saved optimized tool definition to cache");
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
};

export const optimizeToolDefinition = async (
  toolDefinitions: ToolDefinitions,
  target: "openai" | "anthropic" | "google",
  optimization: "fast" | "accurate" | "model-based",
  model?: string
): Promise<ToolDefinitions> => {
  let optimizedToolDefinitions: ToolDefinitions = {
    tools: [],
  };

  if (optimization === "model-based") {
    if (!model) {
      throw new Error("Model is required for model-based optimization");
    }
  }

  if (optimization === "fast") {
    if (target === "openai") {
      model = "gpt-4o";
    } else if (target === "anthropic") {
      model = "claude-3-7-sonnet-20250219";
    } else if (target === "google") {
      model = "gemini-2.0-flash";
    }
  }

  // Generate a hash of the tool definitions to use as a cache key
  const hash = generateHash(
    JSON.stringify(toolDefinitions) + target + optimization + (model || "")
  );

  // Try to load from cache first
  const cachedResult = loadFromCache(hash, target);
  if (cachedResult) {
    return cachedResult;
  }

  // Check ENV fields for OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY to activate for tool definition optimization
  const apiKeys = await checkApiKeys();

  console.log("API Keys", apiKeys);

  // Check if tool definitions are valid
  validateToolDefinitions(toolDefinitions);

  // Optimize tool definitions
  for (const tool of toolDefinitions.tools) {
    const optimizedTool = await optimizer(tool, apiKeys);
    optimizedToolDefinitions.tools.push(optimizedTool);
  }

  // Save the optimized result to cache
  saveToCache(hash, target, optimizedToolDefinitions);

  return optimizedToolDefinitions;
};
