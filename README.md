# Pokemon App (Next.js + HarperDB + Docker Compose)

## Stack
- Frontend & API: Next.js (App Router, TypeScript, Tailwind)
- DB: HarperDB (Docker)
- Auth: JWT

## Quick Start
```bash
docker-compose up --build
```
- App: http://localhost:3000
- HarperDB: http://localhost:9925

### Initialize HarperDB (schema & tables)
Run these once (you can use curl or Postman):

```bash
# Create schema
curl -X POST http://localhost:9925   -H "Content-Type: application/json"   -u admin:password123   -d '{ "operation":"create_schema", "schema":"pokedex" }'

# Create tables
curl -X POST http://localhost:9925 -H "Content-Type: application/json" -u admin:password123 -d '{
  "operation":"create_table",
  "schema":"pokedex",
  "table":"users",
  "hash_attribute":"id"
}'
curl -X POST http://localhost:9925 -H "Content-Type: application/json" -u admin:password123 -d '{
  "operation":"create_table",
  "schema":"pokedex",
  "table":"pokemon",
  "hash_attribute":"id"
}'
curl -X POST http://localhost:9925 -H "Content-Type: application/json" -u admin:password123 -d '{
  "operation":"create_table",
  "schema":"pokedex",
  "table":"favorites",
  "hash_attribute":"id"
}'
```

### Seed sample Pokemon (optional)
```bash
curl -X POST http://localhost:9925 -H "Content-Type: application/json" -u admin:password123 -d '{
  "operation":"insert",
  "schema":"pokedex",
  "table":"pokemon",
  "records":[
    { "id":"1","name":"Bulbasaur","imageUrl":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png","type1":"Grass","type2":"Poison","isLegendary":false,"speed":45 },
    { "id":"4","name":"Charmander","imageUrl":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png","type1":"Fire","isLegendary":false,"speed":65 },
    { "id":"7","name":"Squirtle","imageUrl":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png","type1":"Water","isLegendary":false,"speed":43 },
    { "id":"25","name":"Pikachu","imageUrl":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png","type1":"Electric","isLegendary":false,"speed":90 }
  ]
}'
```

## Scripts
- `docker-compose up --build` – build and run everything
- `docker-compose down` – stop
- `docker-compose logs -f frontend` – follow frontend logs

## Notes
- API routes live inside the Next.js app (`/app/api/*`) and proxy to HarperDB.
- Change credentials & JWT secret for production.
# pokemon-happerDB
