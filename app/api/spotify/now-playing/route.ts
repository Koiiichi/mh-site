import { NextResponse } from 'next/server';

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface SpotifyNowPlayingResponse {
  is_playing: boolean;
  item: {
    name: string;
    artists: Array<{ name: string }>;
    external_urls: {
      spotify: string;
    };
  };
}

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data: SpotifyTokenResponse = await response.json();
  return data.access_token;
}

async function getNowPlaying(access_token: string) {
  const response = await fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  });

  if (response.status === 204) {
    // No content - nothing is playing
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch now playing');
  }

  const data: SpotifyNowPlayingResponse = await response.json();
  return data;
}

export async function GET() {
  try {
    if (!client_id || !client_secret || !refresh_token) {
      return NextResponse.json(
        { error: 'Spotify credentials not configured' },
        { status: 500 }
      );
    }

    const access_token = await getAccessToken();
    const nowPlaying = await getNowPlaying(access_token);

    if (!nowPlaying || !nowPlaying.is_playing) {
      return NextResponse.json({
        isPlaying: false,
      });
    }

    const { item } = nowPlaying;

    return NextResponse.json({
      isPlaying: true,
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(', '),
      url: item.external_urls.spotify,
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch now playing' },
      { status: 500 }
    );
  }
}
