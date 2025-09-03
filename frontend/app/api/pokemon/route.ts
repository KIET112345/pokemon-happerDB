import { NextResponse } from "next/server";
import { harperRaw } from "@/lib/harper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 0);
  const limit = Number(searchParams.get("limit") ?? 20);
  const offset = page * limit;

  const name = searchParams.get("name") ?? "";
  const type = searchParams.get("type") ?? "";
  const legendary = searchParams.get("legendary");
  const speedMin = searchParams.get("speedMin");
  const speedMax = searchParams.get("speedMax");

  // Start with all rows
  let results = await harperRaw({
    operation: "search_by_value",
    schema: "pokedex",
    table: "pokemon",
    search_attribute: "id",
    search_value: "*",
    get_attributes: ["*"],
    limit: 5000,
    offset: 0,
  });

  // Apply filters in JS (since HarperDB search_by_value is limited)
  if (name) {
    results = results.filter((r: any) =>
      r.name?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (type) {
    results = results.filter(
      (r: any) => r.type1 === type || r.type2 === type
    );
  }

  if (legendary === "true") {
    results = results.filter((r: any) => r.isLegendary === true);
  }
  if (legendary === "false") {
    results = results.filter((r: any) => r.isLegendary === false);
  }

  if (speedMin) {
    results = results.filter((r: any) => r.speed >= Number(speedMin));
  }
  if (speedMax) {
    results = results.filter((r: any) => r.speed <= Number(speedMax));
  }

  return NextResponse.json({
    items: results.slice(offset, offset + limit),
    total: results.length,
  });
}
