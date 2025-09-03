import { NextResponse } from 'next/server';
import { harperQuery } from '@/lib/harper';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const rows = await harperQuery('sql', `SELECT * FROM pokedex.pokemon WHERE id='${params.id}'`);
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}
