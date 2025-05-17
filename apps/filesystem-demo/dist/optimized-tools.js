// Auto-generated file - DO NOT EDIT MANUALLY
// Generated using tool definition optimizer

export const optimizedToolDefinitions = {
  "tools": [
    {
      "name": "read_file",
      "description": "Read the complete contents of a file from the file system. Handles various text encodings and provides detailed error messages if the file cannot be read. Use this tool when you need to examine the contents of a single file. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "file_path": {
            "type": "string",
            "description": "Path to the file to read"
          }
        },
        "required": [
          "file_path"
        ]
      }
    },
    {
      "name": "write_file",
      "description": "Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "file_path": {
            "type": "string",
            "description": "Path where the file should be written"
          },
          "content": {
            "type": "string",
            "description": "Content to write to the file"
          }
        },
        "required": [
          "file_path",
          "content"
        ]
      }
    },
    {
      "name": "list_directory",
      "description": "Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory structure and finding specific files within a directory. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "directory_path": {
            "type": "string",
            "description": "Path to the directory to list"
          }
        },
        "required": [
          "directory_path"
        ]
      }
    },
    {
      "name": "list_allowed_directories",
      "description": "Returns the list of directories that this server is allowed to access. Use this to understand which directories are available before trying to access files.",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }
  ]
};
