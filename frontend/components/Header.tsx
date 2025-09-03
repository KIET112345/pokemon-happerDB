export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-bold">Pokédex</div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/pokemon" className="hover:underline">Pokémon</a>
        </nav>
      </div>
    </header>
  );
}
