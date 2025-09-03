'use client';
import { useEffect, useState } from 'react';

type Pokemon = { id: string; name: string; imageUrl: string };

export default function HomePage() {
  const [topTen, setTopTen] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetch('/api/pokemon?limit=10&page=0').then(r => r.json()).then(d => setTopTen(d.items));
  }, []);

  const videos = [
    'https://www.youtube.com/embed/1roy4o4tqQM',
    'https://www.youtube.com/embed/bILE5BEyhdo',
    'https://www.youtube.com/embed/uBYORdr_TY8',
    'https://www.youtube.com/embed/2sj2iQyBTQs',
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map(v => (
          <iframe key={v} src={v} className="w-full aspect-video rounded-xl shadow" allowFullScreen />
        ))}
      </div>

      <h2 className="text-xl font-bold">Top 10 Pokémon</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {topTen.map(p => (
          <div key={p.id} className="p-3 border rounded text-center bg-white">
            <img src={p.imageUrl} className="w-full h-32 object-contain mb-2" />
            <p>{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
