// Global type declarations for the Supabase function

declare module 'https://deno.land/x/hono@v4.6.3/mod.ts' {
  export interface Context<E = {}> {
    req: {
      json(): Promise<any>;
      query(key?: string): string | undefined | Record<string, string>;
      url: string;
    };
    json(data: any, status?: number): Response;
    query(key?: string): string | undefined | Record<string, string>;
  }

  export class Hono<E = {}> {
    use: (path: string, middleware: any) => void;
    get: (path: string, handler: (c: Context<E>) => any) => void;
    post: (path: string, handler: (c: Context<E>) => any) => void;
    put: (path: string, handler: (c: Context<E>) => any) => void;
    fetch: (request: Request) => Response | Promise<Response>;
  }

  export function cors(options?: {
    origin: string | string[];
    allowHeaders: string[];
    allowMethods: string[];
    exposeHeaders: string[];
    maxAge: number;
  }): any;
}
