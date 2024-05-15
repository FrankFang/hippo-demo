# Demo

## Dev

### Setup Database

```bash
DB_URL="postgres://hippo:123456@127.0.0.1:5432/hippo-demo_dev" ./start-database.sh
./start-database.sh
pnpm db:push
```

### Run the Server

```bash
pnpm dev
open http://127.0.0.1:3000
```
