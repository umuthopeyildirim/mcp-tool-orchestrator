import { z } from "zod";
import { ToolSchema } from "@modelcontextprotocol/sdk/types.js";
// Schema definitions
const ReadFileArgsSchema = z.object({
    path: z.string(),
});
const ReadMultipleFilesArgsSchema = z.object({
    paths: z.array(z.string()),
});
const WriteFileArgsSchema = z.object({
    path: z.string(),
    content: z.string(),
});
const EditOperation = z.object({
    oldText: z.string().describe("Text to search for - must match exactly"),
    newText: z.string().describe("Text to replace with"),
});
const EditFileArgsSchema = z.object({
    path: z.string(),
    edits: z.array(EditOperation),
    dryRun: z
        .boolean()
        .default(false)
        .describe("Preview changes using git-style diff format"),
});
const CreateDirectoryArgsSchema = z.object({
    path: z.string(),
});
const ListDirectoryArgsSchema = z.object({
    path: z.string(),
});
const DirectoryTreeArgsSchema = z.object({
    path: z.string(),
});
const MoveFileArgsSchema = z.object({
    source: z.string(),
    destination: z.string(),
});
const SearchFilesArgsSchema = z.object({
    path: z.string(),
    pattern: z.string(),
    excludePatterns: z.array(z.string()).optional().default([]),
});
const GetFileInfoArgsSchema = z.object({
    path: z.string(),
});
const ToolInputSchema = ToolSchema.shape.inputSchema;
export { ReadFileArgsSchema, ReadMultipleFilesArgsSchema, WriteFileArgsSchema, EditOperation, EditFileArgsSchema, CreateDirectoryArgsSchema, ListDirectoryArgsSchema, DirectoryTreeArgsSchema, MoveFileArgsSchema, SearchFilesArgsSchema, GetFileInfoArgsSchema, };
