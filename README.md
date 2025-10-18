# Muneeb Hassan — Portfolio

My portfolio site built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and `next-themes` :))

## Tech stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes) for theming
- [SWR](https://swr.vercel.app/) for data fetching
- Static content via JSON data files in `data/`
- Live Spotify integration via API routes

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Spotify Integration

The site includes a live "Now Playing" section that shows what I'm currently listening to on Spotify.

### Environment Variables

Create a `.env.local` file with your Spotify credentials:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

### Getting Spotify Credentials

1. Create a Spotify app at https://developer.spotify.com/dashboard
2. Get your Client ID and Client Secret
3. Use the authorization flow to get a refresh token
4. Add these to your `.env.local` file

## Deploying to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in **Project Settings → Environment Variables**:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
4. Deploy!

The site will automatically build and deploy. The API route at `/api/spotify/now-playing` will provide live Spotify data.
