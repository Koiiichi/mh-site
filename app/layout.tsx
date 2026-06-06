import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Newsreader } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from './(components)/theme-provider';
import { ThemeHotkey } from './(components)/theme-hotkey';
import { HoldPreviewProvider } from './(components)/hold-preview/hold-preview';
import { ParticleSphereLazy } from './(components)/particle-sphere-lazy';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-mono', display: 'swap' });
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400'], style: ['italic'], variable: '--font-newsreader', display: 'swap' });

// Self-hosted Hiragino Mincho ProN (NGE serif), subset to Latin and converted
// to woff2 from the licensed .ttc. Personal-use licensed.
const hiragino = localFont({
  src: [
    { path: './fonts/HiraginoMinchoProN-W3.woff2', weight: '400', style: 'normal' },
    { path: './fonts/HiraginoMinchoProN-W6.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-mincho',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://muneeb.design'),
  title: {
    default: 'Muneeb Hassan',
    template: '%s · Muneeb Hassan'
  },
  description: 'Working on backend systems, data workflows, and occasionally embedded projects. CS + Stats @UWaterloo.',
  openGraph: {
    title: 'Muneeb Hassan',
    description: 'Working on backend systems, data workflows, and occasionally embedded projects. CS + Stats @UWaterloo.',
    type: 'website',
    url: 'https://muneeb.design',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'Muneeb Hassan portfolio preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muneeb Hassan',
    description: 'Working on backend systems, data workflows, and occasionally embedded projects. CS + Stats @UWaterloo.'
  },
  alternates: {
    canonical: 'https://muneeb.design'
  },
  other: {
    'theme-color': '#0b0c0e',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable} ${newsreader.variable} ${hiragino.variable}`} suppressHydrationWarning>
      <head>
        {/* Critical inline styles - must be first */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent white flash - applied immediately */
            :root {
              background-color: #0b0c0e !important;
            }
            
            html {
              background-color: #0b0c0e !important;
            }
            
            body {
              background-color: #0b0c0e !important;
              transition: none !important;
            }
            
            /* Theme-specific overrides */
            html.light {
              background-color: #fafafb !important;
            }
            
            html.light body {
              background-color: #fafafb !important;
            }
          `
        }} />
        
        {/* Blocking script to prevent flash - runs before any rendering */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('muneeb-theme') || 'dark';
                const root = document.documentElement;
                
                // Set background immediately
                document.documentElement.style.backgroundColor = theme === 'dark' ? '#0b0c0e' : '#fafafb';
                document.documentElement.style.colorScheme = theme;
                
                // Apply theme class
                if (theme === 'dark') {
                  root.classList.add('dark');
                  root.classList.remove('light');
                } else {
                  root.classList.add('light');
                  root.classList.remove('dark');
                }
              } catch (e) {
                // Fallback to dark mode if localStorage fails
                document.documentElement.style.backgroundColor = '#0b0c0e';
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <ThemeHotkey />
          <ParticleSphereLazy />
          <HoldPreviewProvider>
            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-8 pt-10 sm:px-12">
              {children}
            </div>
          </HoldPreviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
