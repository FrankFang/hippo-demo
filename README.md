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

### Prisma

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)
```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```
or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)
```
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()
```

See other ways of importing Prisma Client: http://pris.ly/d/importing-client
