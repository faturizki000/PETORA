import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export function createSupabaseClient(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookies) {
          cookies.forEach((c) => {
            request.cookies.set(c.name, c.value);
            response.cookies.set(c.name, c.value, c.options);
          });
        },
      },
    }
  );
  return { supabase, response };
}
