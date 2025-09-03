"use client";
import { useEffect, useMemo, useState } from "react";

type Pokemon = {
  id: string;
  name: string;
  imageUrl: string;
  type1?: string;
  type2?: string;
  isLegendary?: boolean;
  speed?: number;
};

export default function PokemonPage() {
  const [items, setItems] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [legendary, setLegendary] = useState("all");
  const [speedMin, setSpeedMin] = useState("");
  const [speedMax, setSpeedMax] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (name) p.set("name", name);
    if (type) p.set("type", type);
    if (legendary !== "all") p.set("legendary", legendary);
    if (speedMin) p.set("speedMin", speedMin);
    if (speedMax) p.set("speedMax", speedMax);
    return p;
  }, [page, limit, name, type, legendary, speedMin, speedMax]);

  useEffect(() => {
    console.log("fetching with params", params.toString());
    fetch("/api/pokemon?" + params.toString())
      .then((r) => r.json())
      .then((d) => {
        console.log("fetched data", d);
        setItems(d.items || []);
        setTotal(Number(d.total || 0));
      })
      .catch(console.error);
  }, [params]);

  async function uploadCsv(file: File | null) {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/pokemon/import", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (res.ok) {
      alert("Imported " + (data.inserted || 0) + " records");
      // refresh
      fetch("/api/pokemon?" + params.toString())
        .then((r) => r.json())
        .then((d) => {
          setItems(d.items);
          setTotal(Number(d.total || 0));
        });
    } else {
      alert("Import error: " + (data.error || "unknown"));
    }
  }

  async function toggleFavorite(pokemonId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to use favorites");
      return;
    }
    // Check if already favorite via server? For simplicity try to DELETE first, if 200 -> removed; else POST add.
    try {
      const del = await fetch(`/api/pokemon/${pokemonId}/favorite`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (del.ok) {
        alert("Removed from favorites");
        return;
      }
      // else try POST
      const post = await fetch(`/api/pokemon/${pokemonId}/favorite`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      if (post.ok) {
        alert("Added to favorites");
      } else {
        const j = await post.json();
        alert("Fav error: " + (j.error || "unknown"));
      }
    } catch (err) {
      alert("Favorite toggle error: " + String(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search"
          value={name}
          onChange={(e) => {
            setPage(0);
            setName(e.target.value);
          }}
        />
        <select
          className="border rounded px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          {[
            "Normal",
            "Fire",
            "Water",
            "Grass",
            "Electric",
            "Ice",
            "Fighting",
            "Poison",
            "Ground",
            "Flying",
            "Psychic",
            "Bug",
            "Rock",
            "Ghost",
            "Dragon",
            "Dark",
            "Steel",
            "Fairy",
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={legendary}
          onChange={(e) => setLegendary(e.target.value)}
        >
          <option value="all">All</option>
          <option value="true">Legendary</option>
          <option value="false">Non-legendary</option>
        </select>
        <input
          className="border rounded px-3 py-2 w-32"
          type="number"
          placeholder="Speed Min"
          value={speedMin}
          onChange={(e) => setSpeedMin(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-32"
          type="number"
          placeholder="Speed Max"
          value={speedMax}
          onChange={(e) => setSpeedMax(e.target.value)}
        />

        <label className="flex items-center gap-2 ml-2">
          <input
            id="csvfile"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => uploadCsv(e.target.files?.[0] ?? null)}
          />
          <button
            className="px-3 py-2 border rounded bg-white"
            onClick={() => document.getElementById("csvfile")?.click()}
          >
            Upload CSV
          </button>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((p) => (
          <div key={p.id} className="p-3 border rounded-xl shadow-sm bg-white">
            <div className="relative">
              <img src={p?.imageUrl} className="w-full h-36 object-contain" />
              <button
                onClick={() => toggleFavorite(p.id)}
                className="absolute right-2 top-2 bg-white/90 rounded-full px-2 py-1 text-sm"
              >
                ❤
              </button>
            </div>
            <div className="mt-2 text-center">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs opacity-70">
                {p.type1}
                {p.type2 ? " / " + p.type2 : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="px-3 py-2 border rounded bg-white"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page + 1} / {Math.max(1, Math.ceil(total / limit))}
        </span>
        <button
          disabled={(page + 1) * limit >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-2 border rounded bg-white"
        >
          Next
        </button>
        <select
          value={limit}
          onChange={(e) => {
            setPage(0);
            setLimit(Number(e.target.value));
          }}
          className="ml-2 border rounded px-2 py-2"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
