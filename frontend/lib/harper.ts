export async function harperQuery(operation: string, sql?: string, records?: any[]) {
  const res = await fetch(process.env.HARPERDB_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from((process.env.HARPERDB_USER || '') + ':' + (process.env.HARPERDB_PASS || '')).toString('base64')}`
    },
    body: JSON.stringify({ operation, sql, records })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


// frontend/lib/harper.ts
export async function harperRaw(payload: any) {
  const url = process.env.HARPERDB_URL || process.env.NEXT_PUBLIC_HARPERDB_URL || "http://localhost:9925";
  const authUser = process.env.HARPERDB_USER || process.env.NEXT_PUBLIC_HARPERDB_USER || "admin";
  const authPass = process.env.HARPERDB_PASS || process.env.NEXT_PUBLIC_HARPERDB_PASS || "password123";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(authUser + ":" + authPass).toString("base64")}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HarperDB error: ${txt}`);
  }
  return res.json();
}

/** Run SQL (SELECT, COUNT, etc.) */
export async function harperSQL(sql: string) {
  return harperRaw({ operation: "sql", sql });
}

/** Insert records into a table (records: array of plain objects).
 * Example: await harperInsert('pokedex', 'pokemon', [{ id:'1', name:'Bulba' }])
 */
export async function harperInsert(schema: string, table: string, records: any[]) {
  return harperRaw({ operation: "insert", schema, table, records });
}
