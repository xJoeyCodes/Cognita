declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module "https://esm.sh/@google/generative-ai@0.2.1" {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(params: any): any;
  }
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

declare global {
  const Deno: typeof Deno;
}
