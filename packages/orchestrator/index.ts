import { ToolInput } from "./types.js";
import { Anthropic } from "@anthropic-ai/sdk";

// Orchestrator will get main and old tool definitions and use old tool definitions until it reaches the main tool input.
export const orchestrator = async (
  mainToolDefinition: ToolInput,
  oldToolDefinitions: ToolInput[]
) => {};
