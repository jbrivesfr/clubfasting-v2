import { createClient } from '@supabase/supabase-js';

export class BlackboardFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlackboardFetchError';
  }
}

export interface UserRow {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | undefined;
}

export async function fetchLastUsers(): Promise<UserRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Blackboard: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing. Returning empty array.");
    return [];
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new BlackboardFetchError(`Failed to fetch users: ${error.message}`);
  }

  if (!data || !data.users) {
    return [];
  }

  const sortedUsers = data.users.sort((a: any, b: any) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const last5 = sortedUsers.slice(0, 5);

  return last5.map((u: any) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));
}
