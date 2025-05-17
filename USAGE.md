# MCP Tool Definition Optimizer - Usage Guide

This guide will help you get started with the MCP Tool Definition Optimizer, which evaluates and improves your tool definitions.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/umuthopeyildirim/mcp-tool-operator.git
cd mcp-tool-operator
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm build
```

## Setting up API Keys

The optimizer needs at least one AI provider to work. Set up your API keys in your environment:

```bash
# For OpenAI
export OPENAI_API_KEY=your-openai-api-key

# For Anthropic
export ANTHROPIC_API_KEY=your-anthropic-api-key

# For Google AI
export GOOGLE_API_KEY=your-google-api-key
```

## Running the Test Script

We've included a test script to demonstrate the optimizer in action:

```bash
cd packages/definition-optimizer
node test-optimizer.js
```

This will run the optimizer on a sample write_file tool definition and show the improvement process.

## Optimizing Your Own Tool Definitions

You can optimize your own tool definitions by importing the optimizer in your JavaScript or TypeScript files:

```javascript
import { optimizeToolDefinition } from "@umuthopeyildirim/mcp-tool-definition-optimizer";

// Your tool definition
const myToolDefinition = {
  tools: [
    {
      name: "your_tool_name",
      description: "Your current tool description",
      inputSchema: {
        // your schema here
      },
    },
  ],
};

const main = async () => {
  try {
    // Choose one of the following optimization approaches:

    // 1. Fast optimization with default model
    const fastOptimized = await optimizeToolDefinition(
      myToolDefinition,
      "openai", // or 'anthropic' or 'google'
      "fast"
    );

    // 2. More accurate optimization
    const accurateOptimized = await optimizeToolDefinition(
      myToolDefinition,
      "openai",
      "accurate"
    );

    // 3. Model-based optimization with specific model
    const modelBasedOptimized = await optimizeToolDefinition(
      myToolDefinition,
      "openai",
      "model-based",
      "gpt-4o" // specify the model
    );

    console.log(
      "Optimized description:",
      modelBasedOptimized.tools[0].description
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
```

## How It Works

1. The optimizer generates 5 test scenarios for your tool
2. It evaluates the current description against these scenarios using the selected AI model
3. It collects feedback from failed evaluations
4. It uses the AI model to create an improved description addressing the feedback
5. It repeats the process until either:
   - The description passes 4/5 test scenarios
   - The maximum improvement iterations (3) are reached

The result is a more clear, accurate and efficient tool description that helps AI models better understand how to use your tool.
