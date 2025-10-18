import { NextResponse } from 'next/server';

// Disable caching for this route to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  });
  return response.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();
    
    // Try to get currently playing track
    let response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (response.status === 204 || response.status > 400) {
      // Fall back to recently played
      response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      
      if (response.ok) {
        const recent = await response.json();
        const item = recent.items?.[0]?.track;

        if (item) {
          return NextResponse.json(
            {
              isPlaying: false,
              lastPlayed: item.name,
              artist: item.artists?.map((a: { name: string }) => a.name).join(', '),
              url: item.external_urls?.spotify,
              context: item.album?.name || null,
            },
            {
              headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
              },
            }
          );
        }
      }
      
      return NextResponse.json(
        { isPlaying: false },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }

    const song = await response.json();
    const context = song.item?.album?.name || null;
    
    return NextResponse.json(
      {
        isPlaying: song.is_playing,
        title: song.item.name,
        artist: song.item.artists.map((a: { name: string }) => a.name).join(', '),
        url: song.item.external_urls.spotify,
        context,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { isPlaying: false },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}
