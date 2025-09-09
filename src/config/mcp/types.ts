/**
 * Model Context Protocol (MCP) Types and Interfaces
 * Based on the MCP specification for structured AI model context
 */

export interface MCPServer {
  name: string;
  version: string;
  capabilities: MCPCapabilities;
  tools?: MCPTool[];
  resources?: MCPResource[];
  prompts?: MCPPrompt[];
}

export interface MCPCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: {
    level?: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency';
  };
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: MCPSchema;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments?: MCPPromptArgument[];

}

export interface MCPPromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

export interface MCPSchema {
  type: string;
  properties?: Record<string, MCPSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface MCPSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: MCPSchemaProperty;
  default?: string | boolean;
  properties?: Record<string, MCPSchemaProperty>;
}

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface MCPNotification {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

// Universe-specific MCP extensions
export interface UniverseMCPContext {
  universeType: string;
  universeId?: string;
  temporalScope?: {
    start?: bigint;
    end?: bigint;
    precision?: string;
  };
  realityGradient?: number;
  privacyLevel?: 'public' | 'restricted' | 'private' | 'confidential';
}

export interface UniverseMCPTool extends MCPTool {
  universeTypes: string[];
  context: UniverseMCPContext;
  dataSources: string[];
  restrictions: string[];
}

export interface UniverseMCPResource extends MCPResource {
  universeId?: string;
  temporalRange?: {
    start?: bigint;
    end?: bigint;
  };
  confidenceLevel?: number;
  sources: string[];
}
