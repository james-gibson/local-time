import { MCPRequest, MCPResponse, MCPNotification, MCPError } from './types.js';
import { UniverseMCPServer } from './server.js';

export interface MCPTransport {
  send(message: MCPRequest | MCPNotification): Promise<void>;
  onMessage(handler: (message: MCPResponse | MCPNotification) => void): void;
  close(): Promise<void>;
}

export class UniverseMCPClient {
  private server: UniverseMCPServer;
  private transport?: MCPTransport;
  private requestId = 0;
  private pendingRequests = new Map<string | number, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }>();

  constructor(server?: UniverseMCPServer) {
    this.server = server || new UniverseMCPServer();
  }

  setTransport(transport: MCPTransport): void {
    this.transport = transport;
    this.transport.onMessage(this.handleMessage.bind(this));
  }

  private handleMessage(message: MCPResponse | MCPNotification): void {
    if ('id' in message) {
      // Response to a request
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        this.pendingRequests.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
      }
    } else {
      // Notification - handle as needed
      this.handleNotification(message);
    }
  }

  private handleNotification(notification: MCPNotification): void {
    // Stub for handling notifications
    console.log('Received notification:', notification.method, notification.params);
  }

  private async sendRequest(method: string, params?: any): Promise<any> {
    const id = ++this.requestId;
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      if (this.transport) {
        this.transport.send(request).catch(reject);
      } else {
        // Direct server call for testing/development
        this.handleDirectRequest(request).then(resolve).catch(reject);
      }
    });
  }

  private async handleDirectRequest(request: MCPRequest): Promise<any> {
    try {
      let result: any;

      switch (request.method) {
        case 'tools/list':
          result = { tools: await this.server.listTools() };
          break;
        case 'resources/list':
          result = { resources: await this.server.listResources() };
          break;
        case 'prompts/list':
          result = { prompts: await this.server.listPrompts() };
          break;
        case 'tools/call':
          result = await this.server.callTool(request.params.name, request.params.arguments);
          break;
        case 'resources/read':
          result = await this.server.readResource(request.params.uri);
          break;
        case 'prompts/get':
          result = { 
            messages: [{ 
              role: 'user', 
              content: { 
                type: 'text', 
                text: await this.server.getPrompt(request.params.name, request.params.arguments) 
              } 
            }] 
          };
          break;
        default:
          throw new Error(`Unknown method: ${request.method}`);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // High-level API methods
  async listTools() {
    return this.sendRequest('tools/list');
  }

  async listResources() {
    return this.sendRequest('resources/list');
  }

  async listPrompts() {
    return this.sendRequest('prompts/list');
  }

  async callTool(name: string, arguments_: any) {
    return this.sendRequest('tools/call', { name, arguments: arguments_ });
  }

  async readResource(uri: string) {
    return this.sendRequest('resources/read', { uri });
  }

  async getPrompt(name: string, arguments_?: any) {
    return this.sendRequest('prompts/get', { name, arguments: arguments_ });
  }

  async close(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
    }
  }
}

// Factory function for creating MCP client instances
export function createUniverseMCPClient(server?: UniverseMCPServer): UniverseMCPClient {
  return new UniverseMCPClient(server);
}
