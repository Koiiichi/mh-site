import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './(components)/theme-provider';
import { ThemeHotkey } from './(components)/theme-hotkey';
import { HoldPreviewProvider } from './(components)/hold-preview/hold-preview';
import { CursorHalo } from './(components)/cursor-halo';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-mono', display: 'swap' });
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400'], style: ['italic'], variable: '--font-newsreader', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://muneeb.design'),
  title: {
    default: 'Muneeb Hassan',
    template: '%s · Muneeb Hassan'
  },
  description: 'Design engineer crafting tactile software, systems, and developer tooling.',
  openGraph: {
    title: 'Muneeb Hassan',
    description: 'Design engineer crafting tactile software, systems, and developer tooling.',
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
    description: 'Design engineer crafting tactile software, systems, and developer tooling.'
  },
  alternates: {
    canonical: 'https://muneeb.design'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent white flash on page load */
            html, body {
              background-color: #0b0c0e;
              transition: none !important;
            }
            
            /* Apply theme-specific colors immediately */
            html.dark, html:not(.light) {
              color-scheme: dark;
            }
            
            html.light {
              background-color: #fafafb;
              color-scheme: light;
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `console.log('✅ Verified dark background applied before hydration');`
        }} />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <ThemeHotkey />
          <CursorHalo />
          <HoldPreviewProvider>
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-8 pt-10 sm:px-12">
              {children}
            </div>
          </HoldPreviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
