// frontend/app/api/pokemon/import/route.ts
import { NextResponse } from "next/server";
import { harperInsert } from "@/lib/harper";
import { parse } from "csv-parse/sync";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const text = await file.text();
    // parse CSV with headers, e.g. name,imageUrl,type1,type2,isLegendary,speed
    const records = parse(text, { columns: true, skip_empty_lines: true });

    // Normalize rows:
    const normalized = records.map((r: any) => ({
      id: r.id ? String(r.id) : crypto.randomUUID(),
      name: r.name || "",
      imageUrl: r.imageUrl || "",
      type1: r.type1 || null,
      type2: r.type2 || null,
      isLegendary: r.isLegendary === "true" || r.isLegendary === "1" || r.isLegendary === true,
      speed: r.speed ? Number(r.speed) : null
    }));

    // Insert in batches to avoid huge single payload
    const batchSize = 100;
    for (let i = 0; i < normalized.length; i += batchSize) {
      const batch = normalized.slice(i, i + batchSize);
      await harperInsert("pokedex", "pokemon", batch);
    }

    return NextResponse.json({ inserted: normalized.length });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
