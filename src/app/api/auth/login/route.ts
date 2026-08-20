import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { username, pin } = await request.json();
    const supabase = await createSupabaseClient();

    // In production, verify PIN hash properly
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@petora.local`,
      password: pin,
    });

    if (error) {
      return NextResponse.json({ error: 'Username atau PIN salah' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
