# RigiTrace

RigiTrace is product trust infrastructure: consumers verify a product's identity and
see the evidence behind its trust score, without an account. Brands, retailers, and
regulators contribute evidence that feeds that score.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Architecture

This repository is the **frontend**, plus a **temporary in-repo mock backend**. A real
backend is being built separately.

- `src/app/api/v1/` implements the API contract as Next.js route handlers.
- `src/lib/mock/` backs those route handlers with plain in-memory arrays — there is no
  database.

### The mock backend does not persist data

The in-memory arrays in `src/lib/mock/` live only in the memory of the process that
created them. On Vercel, route handlers run as serverless functions: each request may
be served by a different instance with its own memory. Data written in one request is
not guaranteed to be visible on the next, and is reliably gone after the instance is
recycled.

Locally, with a single long-running `next dev` process, this is easy to miss — the app
behaves as if it remembers everything. **On the deployed environment, it does not.** A
brand, product, or piece of evidence created during one visit can vanish before the
next. Anyone demoing the deployed site — especially to a pilot brand or partner — should
know this going in: the deployment is for reviewing screens and flows, not for
persisting real data.

This is scaffolding with a known expiry date. Once the real backend is ready,
`src/app/api/v1/` and `src/lib/mock/` are deleted, and the frontend points at it
instead.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_API_BASE_URL` must be set explicitly — an empty
string means "use this app's own mock API route handlers"; it does not default
silently to another value.
