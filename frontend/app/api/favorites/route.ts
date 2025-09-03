// frontend/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { harperSQL } from "@/lib/harper";
import { getUserIdFromAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization");
    const userId = getUserIdFromAuth(token);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Join favorites -> pokemon
    const rows = await harperSQL(`SELECT p.* FROM pokedex.pokemon p JOIN pokedex.favorites f ON p.id=f.pokemonId WHERE f.userId='${userId}'`);
    return NextResponse.json({ items: rows });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
