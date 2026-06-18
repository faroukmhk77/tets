# Vintage Sneakers Assouli

E-commerce website for vintage sneakers.

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Never commit `.env` to version control.

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy

### Security Notes

- Admin account must be created on first visit to `/admin/setup`
- Use a strong password (8+ chars, uppercase, lowercase, numbers, symbols)
- Admin session expires after 30 minutes of inactivity
- All admin routes are protected and require authentication

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Framer Motion

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
