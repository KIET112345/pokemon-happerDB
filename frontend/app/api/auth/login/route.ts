import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { harperQuery } from '@/lib/harper';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const users = await harperQuery('sql', `SELECT * FROM pokedex.users WHERE username='${username}'`);
  if (users.length === 0) return NextResponse.json({ error: 'Invalid login' }, { status: 401 });

  const user = users[0];
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Invalid login' }, { status: 401 });

  const token = (await import('jsonwebtoken')).default.sign({ id: user.id, username }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return NextResponse.json({ token });
}
