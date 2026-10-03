import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import LayoutShell from '../components/LayoutShell';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Second Innings | Young Minds. New Perspectives. Wider Possibilities.',
  description: 'Second Innings is a space for young people to talk openly, understand themselves better, explore possibilities and find their own way forward.',
  openGraph: {
    title: 'Second Innings | Young Minds. New Perspectives. Wider Possibilities.',
    description: 'Second Innings is a space for young people to talk openly, understand themselves better, explore possibilities and find their own way forward.',
    url: 'https://secondinnings.com',
    siteName: 'Second Innings',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="grain font-sans antialiased bg-paper text-ink min-h-[100dvh]">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
