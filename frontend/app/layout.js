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
  title: 'Second Innings | Mentoring Young Minds',
  description: 'Second Innings is a mentoring platform for young people aged 16–25. We help you think clearly, see possibilities, and take your next step with confidence.',
  openGraph: {
    title: 'Second Innings | Mentoring Young Minds',
    description: 'A mentoring platform for young people aged 16-25.',
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
