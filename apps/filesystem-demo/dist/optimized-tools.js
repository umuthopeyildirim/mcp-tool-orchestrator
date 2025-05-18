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
          "path": {
            "type": "string"
          }
        },
        "required": [
          "path"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "read_multiple_files",
      "description": "Read the contents of multiple files simultaneously. This is more efficient than reading files one by one when you need to analyze or compare multiple files. Each file's content is returned with its path as a reference. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "paths": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "paths"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "write_file",
      "description": "Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          },
          "content": {
            "type": "string"
          }
        },
        "required": [
          "path",
          "content"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "edit_file",
      "description": "# edit_file\n\nMakes precise line-by-line edits to text files by replacing exact text sequences with new content. Each edit operation searches for the exact oldText (including whitespace and indentation) and replaces it with newText. The tool returns a git-style diff showing additions and deletions, with added lines prefixed with '+' and removed lines with '-'.\n\n## When to use\n- Updating configuration values in text files\n- Modifying code (changing function signatures, fixing bugs, refactoring)  \n- Updating text content (fixing typos, updating copyright notices in individual files)\n- Making consistent changes across a file\n\n## Limitations and cautions\n- Only works in project-specific directories (src/, config/, etc. - not system directories)\n- Matches text exactly, including whitespace and indentation\n- If oldText appears multiple times, all instances will be replaced\n- Edits are applied sequentially in the order provided\n- No regex/pattern support - only exact string matching\n- Make backups of important files before editing\n- Large files may cause performance issues\n- Different line endings (CRLF vs LF) may affect matching\n- Does not work on binary files\n\n## Parameters\n- `path`: Path to the file to edit (relative to project root)\n- `edits`: Array of edit operations, each containing:\n  - `oldText`: Exact text to replace (must match precisely)\n  - `newText`: New text to insert instead\n- `dryRun`: Set to true to preview changes without modifying the file (defaults to false)",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          },
          "edits": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "oldText": {
                  "type": "string",
                  "description": "Text to search for - must match exactly"
                },
                "newText": {
                  "type": "string",
                  "description": "Text to replace with"
                }
              },
              "required": [
                "oldText",
                "newText"
              ],
              "additionalProperties": false
            }
          },
          "dryRun": {
            "type": "boolean",
            "default": false,
            "description": "Preview changes using git-style diff format"
          }
        },
        "required": [
          "path",
          "edits"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "create_directory",
      "description": "Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. If the directory already exists, this operation will succeed silently. Perfect for setting up directory structures for projects or ensuring required paths exist. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          }
        },
        "required": [
          "path"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "list_directory",
      "description": "Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory structure and finding specific files within a directory. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          }
        },
        "required": [
          "path"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "directory_tree",
      "description": "Get a recursive tree view of files and directories as a JSON structure. Each entry includes 'name', 'type' (file/directory), and 'children' for directories. Files have no children array, while directories always have a children array (which may be empty). The output is formatted with 2-space indentation for readability. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          }
        },
        "required": [
          "path"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "move_file",
      "description": "Move or rename files and directories. Can move files between directories and rename them in a single operation. If the destination exists, the operation will fail. Works across different directories and can be used for simple renaming within the same directory. Both source and destination must be within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "source": {
            "type": "string"
          },
          "destination": {
            "type": "string"
          }
        },
        "required": [
          "source",
          "destination"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "search_files",
      "description": "Recursively search for files and directories matching a pattern. Searches through all subdirectories from the starting path. The search is case-insensitive and matches partial names. Returns full paths to all matching items. Great for finding files when you don't know their exact location. Only searches within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          },
          "pattern": {
            "type": "string"
          },
          "excludePatterns": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "default": []
          }
        },
        "required": [
          "path",
          "pattern"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
      }
    },
    {
      "name": "get_file_info",
      "description": "Retrieve detailed metadata about a file or directory. Returns comprehensive information including size, creation time, last modified time, permissions, and type. This tool is perfect for understanding file characteristics without reading the actual content. Only works within allowed directories.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          }
        },
        "required": [
          "path"
        ],
        "additionalProperties": false,
        "$schema": "http://json-schema.org/draft-07/schema#"
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
