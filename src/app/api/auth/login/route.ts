import { NextResponse } from 'next/server';
import { verifyPinAction } from '@/app/actions/auth.actions';

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { username, pin } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const key = `${ip}:${username}`;

    const now = Date.now();
    const record = rateLimit.get(key);

    if (record && now < record.resetTime) {
      if (record.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((record.resetTime - now) / 60000)} menit.` },
          { status: 429 }
        );
      }
      record.count++;
    } else {
      rateLimit.set(key, { count: 1, resetTime: now + WINDOW_MS });
    }

    const result = await verifyPinAction(username, pin);

    if (!result.success || !result.data) {
      return NextResponse.json({ error: 'Username atau PIN salah' }, { status: 401 });
    }

    rateLimit.delete(key);
    return NextResponse.json({ success: true, user: result.data });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
