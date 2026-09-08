# AMK Ads — Admin Panel

A **standalone** Cloudflare Pages project for managing the AMK Ads portfolio, division galleries, and service videos. Completely decoupled from the public-facing website.

---

## Architecture

```
amkadvertising.com  (main Next.js site  — no admin routes)
        │
        │ API calls (CORS-protected)
        ▼
  Cloudflare Worker  (amkads.workers.dev)
        │
        │ API calls (auth cookie)
        ▼
admin.amkadvertising.com  (this project — Cloudflare Pages)
```

---

## Security Model

- **Credentials never touch the browser** — `ADMIN_USERNAME` and `ADMIN_PASSWORD` live only as Cloudflare Worker environment variables.
- Login submits to `POST /api/admin/login` on the Worker, which compares against env vars.
- On success the Worker issues a **signed JWT** as an `HttpOnly; SameSite=None; Secure` cookie — inaccessible to JavaScript.
- Every protected page first calls `GET /api/admin/me`. The Worker validates the cookie server-side and returns `200` or `401`. No secret ever leaves the server.

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | Public | Login form — entry point |
| `/dashboard` | Protected | Portfolio campaign management |
| `/dashboard/division-media` | Protected | Division gallery images & videos |
| `/dashboard/service-videos` | Protected | Service modal videos |

---

## Local Development

### 1. Copy environment file
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_URL=https://amkads.your-subdomain.workers.dev
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start dev server
```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`.

---

## Production Deployment (Cloudflare Pages)

1. Push this folder (`amkads-admin/`) to a new Git repository.
2. In Cloudflare Pages, create a new project connected to that repo.
3. **Build settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Environment Variables** (Settings → Environment Variables):
   - `VITE_API_URL` = your Worker URL (e.g. `https://amkads.your-subdomain.workers.dev`)
5. **Worker CORS:** Set the `ADMIN_ORIGIN` environment variable on your **Worker** to include your Pages domain:
   - `ADMIN_ORIGIN` = `https://amkads-admin.pages.dev,https://admin.amkadvertising.com`

---

## Worker Environment Variables

Set these in the Cloudflare Workers dashboard under **Settings → Variables**:

| Variable | Description |
|---|---|
| `ADMIN_USERNAME` | Admin login username (`Admin123`) |
| `ADMIN_PASSWORD` | Admin login password (`MansoorZeshan$#$#`) |
| `JWT_SECRET` | A long random secret for signing JWT tokens |
| `ADMIN_ORIGIN` | Comma-separated allowed origins for CORS |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `CONTACT_RECEIVER_EMAIL` | Email address to receive contact form submissions |
