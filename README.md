# FurFinds

The public-facing website for FurFinds — a pet-friendly business discovery platform that
connects pet owners with verified pet-friendly businesses through a proprietary 3-tier
verification system (Pets Allowed, Pet-Friendly, Pet-Inclusive).

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (auth + data)
- **Hosting:** Cloudflare Pages/Workers via `@opennextjs/cloudflare`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment example and fill in your Supabase project credentials:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app` — pages (App Router), one folder per route
- `src/components` — shared UI (Header, Footer, BusinessCard, TierBadge, etc.)
- `src/lib/data.ts` — sample business & blog data used throughout the site (replace with live
  Supabase queries as the backend schema comes online)
- `src/lib/supabase.ts` — Supabase client
- `src/lib/types.ts` — shared TypeScript types (Business, Category, Tier, BlogPost)

### Pages implemented

Homepage, Search & Discover, Business Profile, For Businesses, 10-step Business Application,
About Us, Blog (feed + post), legal pages (Terms, Privacy, Cookies, Pet Parent Guidelines, User
Review Guidelines), Report a Complaint, Login/Signup, Pet Owner account, and Business dashboard.

## Images

Business and blog photos currently use [Lorem Picsum](https://picsum.photos) (real, non-AI
stock photography) as deterministic placeholders. Swap the URLs in `src/lib/data.ts` for
curated Pexels/Unsplash photos of real businesses before launch — do not use AI-generated images
per brand guidelines.

## Deploying to Cloudflare

This project uses [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) to deploy the
Next.js app to Cloudflare Workers (the supported successor to Cloudflare Pages for full Next.js
apps with SSR).

1. In the Cloudflare dashboard, connect this GitHub repository (Workers & Pages → Create →
   connect to Git).
2. Set the **Build command** to `npm run build` (this runs `next build`, then adapts the
   output for Cloudflare via `@opennextjs/cloudflare`) and the **Deploy command** to
   `npx wrangler deploy` (or just use `npm run deploy` locally, which chains both).
3. Add these environment variables in the Cloudflare project settings:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |

4. `wrangler.toml` and `open-next.config.ts` are already configured at the project root.

### Local preview against Cloudflare's runtime

```bash
npm run preview
```

### Deploy manually

```bash
npm run deploy
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Supabase Documentation](https://supabase.com/docs)
