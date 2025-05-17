import { default as models } from "./models.json" with { type: "json" };
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
// System Prompt for the evaluation
const systemPrompt = `
You are a tool definition evaluator.
You are given a tool definition and you need to determine if the description is clear, accurate, and efficient.
Evaluate if the description clearly explains:
1. What the tool does
2. When to use it
3. Any limitations or cautions
4. Required parameters

Answer with YES if the description is excellent, or NO with specific feedback for improvement.
`;
// Function to generate test scenarios using LLM
const generateTestScenarios = async (tool, provider, model) => {
    const prompt = `
Generate 5 realistic user scenarios for testing the following tool:

TOOL DEFINITION:
Name: ${tool.name}
Description: ${tool.description}
Input Schema: ${JSON.stringify(tool.inputSchema, null, 2)}

For each scenario:
1. Create a natural language request that a user might make when they need to use this tool
2. Make the scenarios diverse and cover different use cases
3. Include common edge cases or limitations that might be important to test
4. Format each scenario as a simple user query (no numbering or prefixes)

Return ONLY the 5 scenarios as plain text, one per line.
`;
    let response = "";
    try {
        if (provider === "openai" && process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const completion = await openai.chat.completions.create({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });
            response = completion.choices[0]?.message?.content || "";
        }
        else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });
            const message = await anthropic.messages.create({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
                temperature: 0.7,
            });
            response = message.content[0]?.text || "";
        }
        else if (provider === "google" && process.env.GOOGLE_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const genModel = genAI.getGenerativeModel({ model });
            const result = await genModel.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            response = result.response.text();
        }
        // Parse the response into individual scenarios
        const scenarios = response
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .slice(0, 5); // Ensure we get at most 5 scenarios
        // If we didn't get enough scenarios, add some defaults
        if (scenarios.length < 5) {
            const defaultScenarios = [
                `I need to use the ${tool.name} tool to perform a basic operation`,
                `I want to understand what the ${tool.name} tool does`,
                `I need to know the limitations of the ${tool.name} tool`,
                `I'm trying to decide if the ${tool.name} tool is right for my use case`,
                `I need to understand what parameters to provide to ${tool.name}`,
            ];
            while (scenarios.length < 5) {
                scenarios.push(defaultScenarios[scenarios.length]);
            }
        }
        return scenarios;
    }
    catch (error) {
        console.error(`Error generating scenarios with ${provider}:`, error);
        // Fall back to default scenarios if LLM generation fails
        if (tool.name === "write_file") {
            return [
                "I need to save some text to a new file called 'notes.txt'",
                "I want to update my config.json file with new settings",
                "I need to create a large markdown file with documentation",
                "I need to save binary data to a file",
                "I want to append data to an existing file",
            ];
        }
        else {
            return [
                `I need to use the ${tool.name} tool to perform a basic operation`,
                `I want to understand what the ${tool.name} tool does`,
                `I need to know the limitations of the ${tool.name} tool`,
                `I'm trying to decide if the ${tool.name} tool is right for my use case`,
                `I need to understand what parameters to provide to ${tool.name}`,
            ];
        }
    }
};
// Function to run evaluation with a specific provider
const evaluateWithProvider = async (provider, model, tool, scenario) => {
    try {
        const prompt = `
TOOL DEFINITION:
Name: ${tool.name}
Description: ${tool.description}
Input Schema: ${JSON.stringify(tool.inputSchema, null, 2)}

USER SCENARIO:
${scenario}

Based on the tool definition above, evaluate if the description clearly explains what the tool does, when to use it, any limitations, and required parameters for this scenario.
`;
        let response = "";
        if (provider === "openai" && process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
            });
            response = completion.choices[0]?.message?.content || "";
        }
        else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });
            const message = await anthropic.messages.create({
                model,
                system: systemPrompt,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
            });
            response = message.content[0]?.text || "";
        }
        else if (provider === "google" && process.env.GOOGLE_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const genModel = genAI.getGenerativeModel({ model });
            const result = await genModel.generateContent({
                contents: [
                    { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] },
                ],
            });
            response = result.response.text();
        }
        const passed = response.toLowerCase().includes("yes");
        return {
            passed,
            feedback: response,
        };
    }
    catch (error) {
        console.error(`Error evaluating with ${provider}:`, error);
        return {
            passed: false,
            feedback: `Error: ${error.message}`,
        };
    }
};
// Function to improve the description based on feedback
const improveDescription = async (provider, model, tool, feedback) => {
    try {
        const prompt = `
CURRENT TOOL DEFINITION:
Name: ${tool.name}
Description: ${tool.description}
Input Schema: ${JSON.stringify(tool.inputSchema, null, 2)}

EVALUATION FEEDBACK:
${feedback.join("\n\n")}

Please generate an improved description for this tool that addresses all the feedback above.
The description should clearly explain what the tool does, when to use it, any limitations or cautions, and required parameters.
Provide ONLY the improved description text without any additional commentary or explanation.
`;
        let response = "";
        if (provider === "openai" && process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const completion = await openai.chat.completions.create({
                model,
                messages: [{ role: "user", content: prompt }],
            });
            response = completion.choices[0]?.message?.content || "";
        }
        else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });
            const message = await anthropic.messages.create({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
            });
            response = message.content[0]?.text || "";
        }
        else if (provider === "google" && process.env.GOOGLE_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const genModel = genAI.getGenerativeModel({ model });
            const result = await genModel.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            response = result.response.text();
        }
        return response.trim();
    }
    catch (error) {
        console.error(`Error improving description with ${provider}:`, error);
        return tool.description;
    }
};
export const optimizer = async (toolDefinition, apiKeys) => {
    console.log("Optimizing tool definition", toolDefinition);
    let optimizedTool = { ...toolDefinition };
    let improvementsMade = 0;
    const maxImprovements = 3; // Limit iterations to prevent infinite loops
    const passThreshold = 4; // Out of 5 test scenarios
    // Select the first available provider for evaluation - prioritize the working ones
    let availableProviders = [];
    if (apiKeys.anthropic) {
        availableProviders.push({
            provider: "anthropic",
            model: models.anthropic[0],
        });
    }
    if (apiKeys.google) {
        availableProviders.push({ provider: "google", model: models.google[0] });
    }
    if (apiKeys.openai) {
        availableProviders.push({ provider: "openai", model: models.openai[0] });
    }
    if (availableProviders.length === 0) {
        console.log("No API keys available, skipping optimization");
        return optimizedTool;
    }
    // Use the first provider by default
    let currentProviderIndex = 0;
    let currentProvider = availableProviders[currentProviderIndex].provider;
    let currentModel = availableProviders[currentProviderIndex].model;
    console.log(`Using provider: ${currentProvider} with model: ${currentModel}`);
    // Generate test scenarios
    console.log("Generating test scenarios...");
    let scenarios = [];
    try {
        scenarios = await generateTestScenarios(toolDefinition, currentProvider, currentModel);
        console.log("Generated scenarios:", scenarios);
    }
    catch (error) {
        console.error("Failed to generate scenarios with primary provider, trying alternatives...");
        // Try other providers if the first one fails
        let scenariosGenerated = false;
        for (let i = 1; i < availableProviders.length; i++) {
            const nextProviderIndex = (currentProviderIndex + i) % availableProviders.length;
            const nextProvider = availableProviders[nextProviderIndex].provider;
            const nextModel = availableProviders[nextProviderIndex].model;
            try {
                scenarios = await generateTestScenarios(toolDefinition, nextProvider, nextModel);
                // Update current provider to this working one
                currentProviderIndex = nextProviderIndex;
                currentProvider = nextProvider;
                currentModel = nextModel;
                scenariosGenerated = true;
                console.log("Generated scenarios with alternative provider:", scenarios);
                break;
            }
            catch (nextError) {
                console.log(`Failed to generate scenarios with ${nextProvider} as well`);
            }
        }
        // If all providers fail, fall back to default scenarios
        if (!scenariosGenerated) {
            if (toolDefinition.name === "write_file") {
                scenarios = [
                    "I need to save some text to a new file called 'notes.txt'",
                    "I want to update my config.json file with new settings",
                    "I need to create a large markdown file with documentation",
                    "I need to save binary data to a file",
                    "I want to append data to an existing file",
                ];
            }
            else {
                scenarios = [
                    `I need to use the ${toolDefinition.name} tool to perform a basic operation`,
                    `I want to understand what the ${toolDefinition.name} tool does`,
                    `I need to know the limitations of the ${toolDefinition.name} tool`,
                    `I'm trying to decide if the ${toolDefinition.name} tool is right for my use case`,
                    `I need to understand what parameters to provide to ${toolDefinition.name}`,
                ];
            }
            console.log("Using default scenarios as all providers failed:", scenarios);
        }
    }
    while (improvementsMade < maxImprovements) {
        console.log(`Evaluation iteration ${improvementsMade + 1}`);
        let evaluationResults = [];
        let anySuccessfulEval = false;
        // Try each scenario with the current provider
        for (const scenario of scenarios) {
            try {
                const result = await evaluateWithProvider(currentProvider, currentModel, optimizedTool, scenario);
                evaluationResults.push(result);
                anySuccessfulEval = true;
            }
            catch (error) {
                console.log(`Error with ${currentProvider} provider:`, error.message);
                // Try with the next provider if available
                let foundWorkingProvider = false;
                for (let i = 1; i < availableProviders.length; i++) {
                    const nextProviderIndex = (currentProviderIndex + i) % availableProviders.length;
                    const nextProvider = availableProviders[nextProviderIndex].provider;
                    const nextModel = availableProviders[nextProviderIndex].model;
                    try {
                        console.log(`Trying with alternative provider: ${nextProvider}`);
                        const result = await evaluateWithProvider(nextProvider, nextModel, optimizedTool, scenario);
                        evaluationResults.push(result);
                        // Update current provider to this working one
                        currentProviderIndex = nextProviderIndex;
                        currentProvider = nextProvider;
                        currentModel = nextModel;
                        foundWorkingProvider = true;
                        anySuccessfulEval = true;
                        break;
                    }
                    catch (nextError) {
                        console.log(`Alternative provider ${nextProvider} also failed:`, nextError.message);
                    }
                }
                if (!foundWorkingProvider) {
                    evaluationResults.push({
                        passed: false,
                        feedback: "All providers failed authentication",
                    });
                }
            }
        }
        if (!anySuccessfulEval) {
            console.log("All providers failed. Unable to optimize tool definition.");
            return optimizedTool;
        }
        const passedCount = evaluationResults.filter((r) => r.passed).length;
        console.log(`Passed ${passedCount} out of ${scenarios.length} scenarios`);
        // If we pass enough tests, we're done
        if (passedCount >= passThreshold) {
            console.log("Optimization successful");
            break;
        }
        // Collect feedback from failed tests
        const feedback = evaluationResults
            .filter((r) => !r.passed)
            .map((r) => r.feedback);
        if (feedback.length === 0) {
            console.log("No feedback collected to improve description");
            break;
        }
        // Improve the description based on feedback
        try {
            const improvedDescription = await improveDescription(currentProvider, currentModel, optimizedTool, feedback);
            // Update the tool definition with the improved description
            optimizedTool = {
                ...optimizedTool,
                description: improvedDescription,
            };
        }
        catch (error) {
            console.log("Error improving description:", error.message);
            // Try with another provider if available
            let descriptionImproved = false;
            for (let i = 1; i < availableProviders.length; i++) {
                const nextProviderIndex = (currentProviderIndex + i) % availableProviders.length;
                const nextProvider = availableProviders[nextProviderIndex].provider;
                const nextModel = availableProviders[nextProviderIndex].model;
                try {
                    console.log(`Trying to improve with alternative provider: ${nextProvider}`);
                    const improvedDescription = await improveDescription(nextProvider, nextModel, optimizedTool, feedback);
                    // Update the tool definition with the improved description
                    optimizedTool = {
                        ...optimizedTool,
                        description: improvedDescription,
                    };
                    // Update current provider to this working one
                    currentProviderIndex = nextProviderIndex;
                    currentProvider = nextProvider;
                    currentModel = nextModel;
                    descriptionImproved = true;
                    break;
                }
                catch (nextError) {
                    console.log(`Alternative provider ${nextProvider} also failed for improvement:`, nextError.message);
                }
            }
            if (!descriptionImproved) {
                console.log("All providers failed to improve description. Returning current version.");
                break;
            }
        }
        improvementsMade++;
    }
    return optimizedTool;
};
