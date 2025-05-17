# MCP Tool Definition Optimizer

A tool to evaluate and optimize tool definitions for better clarity and effectiveness across different AI providers.

## Features

- Evaluates tool definitions against common usage scenarios
- Tests descriptions with OpenAI, Anthropic, and Google AI models
- Iteratively improves descriptions based on AI feedback
- Ensures descriptions clearly explain what the tool does, when to use it, limitations, and required parameters

## Installation

```bash
npm install @umuthopeyildirim/mcp-tool-definition-optimizer
```

## Usage

```javascript
import { optimizeToolDefinition } from "@umuthopeyildirim/mcp-tool-definition-optimizer";

// Your tool definition
const toolDefinition = {
  tools: [
    {
      name: "write_file",
      description:
        "Create a new file or overwrite an existing file with content.",
      inputSchema: {
        // schema details here
      },
    },
  ],
};

// Optimize the tool definition
const optimizedDefinition = await optimizeToolDefinition(
  toolDefinition,
  "openai", // target provider: 'openai', 'anthropic', or 'google'
  "model-based", // optimization strategy: 'fast', 'accurate', or 'model-based'
  "gpt-4o" // model name (required for 'model-based' strategy)
);

console.log("Optimized description:", optimizedDefinition.tools[0].description);
```

## API Reference

### optimizeToolDefinition(toolDefinitions, target, optimization, model?)

Optimizes the provided tool definitions:

- `toolDefinitions`: Object containing an array of tool definitions
- `target`: Target AI provider ('openai', 'anthropic', or 'google')
- `optimization`: Optimization strategy ('fast', 'accurate', or 'model-based')
- `model`: Specific model to use (required for 'model-based' strategy)

## Environment Variables

Set at least one of these API keys:

- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `GOOGLE_API_KEY`: Your Google AI API key

## Testing

Run the included test script to see the optimizer in action:

```bash
node test-optimizer.js
```

Make sure to set your API keys in the environment before running the test.
