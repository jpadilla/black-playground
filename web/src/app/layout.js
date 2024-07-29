import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const DEFAULT_OG_IMAGE = 'https://black.vercel.app/static/screenshot.png';

export const metadata = {
  title: 'Black Playground',
  description: 'Playground for Black, the uncompromising Python code formatter.',
  openGraph: {
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
