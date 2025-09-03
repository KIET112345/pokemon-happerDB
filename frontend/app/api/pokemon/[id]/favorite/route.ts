// frontend/app/api/pokemon/[id]/favorite/route.ts
import { NextResponse } from "next/server";
import { harperInsert, harperSQL } from "@/lib/harper";
import { getUserIdFromAuth } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization");
    const userId = getUserIdFromAuth(token);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = crypto.randomUUID();
    await harperInsert("pokedex", "favorites", [{ id, userId, pokemonId: params.id }]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization");
    const userId = getUserIdFromAuth(token);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await harperSQL(`DELETE FROM pokedex.favorites WHERE userId='${userId}' AND pokemonId='${params.id}'`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
