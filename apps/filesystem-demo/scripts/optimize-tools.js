#!/usr/bin/env node

import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { optimizeToolDefinition } from "@umuthopeyildirim/mcp-tool-definition-optimizer";
import {
  ReadFileArgsSchema,
  ReadMultipleFilesArgsSchema,
  WriteFileArgsSchema,
  EditFileArgsSchema,
  CreateDirectoryArgsSchema,
  ListDirectoryArgsSchema,
  DirectoryTreeArgsSchema,
  MoveFileArgsSchema,
  SearchFilesArgsSchema,
  GetFileInfoArgsSchema,
} from "../dist/types.js";

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
      inputSchema: zodToJsonSchema(ReadFileArgsSchema),
    },
    {
      name: "read_multiple_files",
      description:
        "Read the contents of multiple files simultaneously. This is more " +
        "efficient than reading files one by one when you need to analyze " +
        "or compare multiple files. Each file's content is returned with its " +
        "path as a reference. Failed reads for individual files won't stop " +
        "the entire operation. Only works within allowed directories.",
      inputSchema: zodToJsonSchema(ReadMultipleFilesArgsSchema),
    },
    {
      name: "write_file",
      description:
        "Create a new file or completely overwrite an existing file with new content. " +
        "Use with caution as it will overwrite existing files without warning. " +
        "Handles text content with proper encoding. Only works within allowed directories.",
      inputSchema: zodToJsonSchema(WriteFileArgsSchema),
    },
    {
      name: "edit_file",
      description:
        "Make line-based edits to a text file. Each edit replaces exact line sequences " +
        "with new content. Returns a git-style diff showing the changes made. " +
        "Only works within allowed directories.",
      inputSchema: zodToJsonSchema(EditFileArgsSchema),
    },
    {
      name: "create_directory",
      description:
        "Create a new directory or ensure a directory exists. Can create multiple " +
        "nested directories in one operation. If the directory already exists, " +
        "this operation will succeed silently. Perfect for setting up directory " +
        "structures for projects or ensuring required paths exist. Only works within allowed directories.",
      inputSchema: zodToJsonSchema(CreateDirectoryArgsSchema),
    },
    {
      name: "list_directory",
      description:
        "Get a detailed listing of all files and directories in a specified path. " +
        "Results clearly distinguish between files and directories with [FILE] and [DIR] " +
        "prefixes. This tool is essential for understanding directory structure and " +
        "finding specific files within a directory. Only works within allowed directories.",
      inputSchema: zodToJsonSchema(ListDirectoryArgsSchema),
    },
    {
      name: "directory_tree",
      description:
        "Get a recursive tree view of files and directories as a JSON structure. " +
        "Each entry includes 'name', 'type' (file/directory), and 'children' for directories. " +
        "Files have no children array, while directories always have a children array (which may be empty). " +
        "The output is formatted with 2-space indentation for readability. Only works within allowed directories.",
      inputSchema: zodToJsonSchema(DirectoryTreeArgsSchema),
    },
    {
      name: "move_file",
      description:
        "Move or rename files and directories. Can move files between directories " +
        "and rename them in a single operation. If the destination exists, the " +
        "operation will fail. Works across different directories and can be used " +
        "for simple renaming within the same directory. Both source and destination must be within allowed directories.",
      inputSchema: zodToJsonSchema(MoveFileArgsSchema),
    },
    {
      name: "search_files",
      description:
        "Recursively search for files and directories matching a pattern. " +
        "Searches through all subdirectories from the starting path. The search " +
        "is case-insensitive and matches partial names. Returns full paths to all " +
        "matching items. Great for finding files when you don't know their exact location. " +
        "Only searches within allowed directories.",
      inputSchema: zodToJsonSchema(SearchFilesArgsSchema),
    },
    {
      name: "get_file_info",
      description:
        "Retrieve detailed metadata about a file or directory. Returns comprehensive " +
        "information including size, creation time, last modified time, permissions, " +
        "and type. This tool is perfect for understanding file characteristics " +
        "without reading the actual content. Only works within allowed directories.",
      inputSchema: zodToJsonSchema(GetFileInfoArgsSchema),
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
