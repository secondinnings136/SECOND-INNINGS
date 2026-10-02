import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import LayoutShell from '../components/LayoutShell';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-800 bg-white min-h-screen">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
