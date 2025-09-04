const url = "http://harperdb:9925";   // 👈 use service name, not localhost
const auth = "Basic " + Buffer.from("admin:password123").toString("base64");

async function harper(payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify(payload),
  });

  const txt = await res.text();
  if (!res.ok) throw new Error(txt);
  return JSON.parse(txt);
}

async function ensureSchemaAndTables() {
  try {
    console.log("Creating schema pokedex…");
    await harper({ operation: "create_schema", schema: "pokedex" });
  } catch (e) {
    console.log("Schema may already exist:", e.message);
  }

  const tables = ["users", "pokemon", "favorites"];

  for (const t of tables) {
    try {
      console.log(`Creating table ${t}…`);
      await harper({
        operation: "create_table",
        schema: "pokedex",
        table: t,
        hash_attribute: "id",
      });
    } catch (e) {
      console.log(`Table ${t} may already exist:`, e.message);
    }
  }

  console.log("✅ Schema & tables ready");
}

ensureSchemaAndTables().catch((err) => {
  console.error("Init error:", err);
  process.exit(1);
});
