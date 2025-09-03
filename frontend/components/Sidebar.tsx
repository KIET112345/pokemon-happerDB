export default function Sidebar() {
  return (
    <aside className="hidden md:block w-56 border-r bg-white/60">
      <nav className="p-4 space-y-2 text-sm">
        <a href="/" className="block hover:underline">Home</a>
        <a href="/pokemon" className="block hover:underline">Pokémon</a>
      </nav>
    </aside>
  );
}
