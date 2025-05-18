export interface ToolInput {
  name: string;
  description: string;
  inputSchema: any;
}

export type ToolDefinitions = {
  tools: ToolInput[];
};
