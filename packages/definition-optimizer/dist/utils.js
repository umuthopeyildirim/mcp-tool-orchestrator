import crypto from "crypto";
/**
 * Generate a hash from a string input
 * @param input The string to hash
 * @returns A hash string
 */
export const generateHash = (input) => {
    return crypto.createHash("md5").update(input).digest("hex");
};
export const checkApiKeys = () => {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;
    let result = {
        openai: false,
        anthropic: false,
        google: false,
    };
    if (openaiApiKey) {
        result.openai = true;
    }
    if (anthropicApiKey) {
        result.anthropic = true;
    }
    if (googleApiKey) {
        result.google = true;
    }
    return Promise.resolve(result);
};
export const validateToolDefinitions = (toolDefinitions) => {
    // Basic validation to ensure tools array exists and has at least one tool
    if (!toolDefinitions.tools ||
        !Array.isArray(toolDefinitions.tools) ||
        toolDefinitions.tools.length === 0) {
        throw new Error("Tool definitions must contain at least one tool");
    }
    // Validate each tool
    toolDefinitions.tools.forEach((tool, index) => {
        if (!tool.name) {
            throw new Error(`Tool at index ${index} is missing a name`);
        }
        if (!tool.description) {
            throw new Error(`Tool '${tool.name}' is missing a description`);
        }
        if (!tool.inputSchema) {
            throw new Error(`Tool '${tool.name}' is missing an inputSchema`);
        }
    });
};
