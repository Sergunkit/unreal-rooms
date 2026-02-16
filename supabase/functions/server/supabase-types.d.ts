// Type definitions for Supabase client
interface User {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
}

interface AuthResponse {
  data: {
    user: User | null;
    session: any;
  };
  error: any;
}

interface CreateUserResponse {
  data: {
    user: User | null;
  };
  error: any;
}

interface SignInResponse {
  data: {
    user: User | null;
    session: any;
  };
  error: any;
}

interface SupabaseClient {
  auth: {
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<SignInResponse>;
    admin: {
      createUser: (options: { email: string; password: string; user_metadata?: Record<string, any>; email_confirm?: boolean }) => Promise<CreateUserResponse>;
    };
  };
  from: (table: string) => any;
}

declare module 'https://esm.sh/@supabase/supabase-js' {
  export function createClient(supabaseUrl: string, supabaseKey: string): SupabaseClient;
  export default createClient;
}

// Declare Deno namespace for Supabase functions
declare namespace Deno {
  const env: {
    get(key: string): string | undefined;
  };
  function serve(fetchHandler: (request: Request) => Response | Promise<Response>): void;
}
