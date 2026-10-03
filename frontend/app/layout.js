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
  metadataBase: new URL('https://second-innings.in'),
  title: {
    default: 'Second Innings | Mentoring Young Minds (Ages 16–25) — Deepak Sogani',
    template: '%s | Second Innings',
  },
  description:
    'Second Innings is a human-led youth mentoring platform founded by Deepak Sogani (former Dean/Head of Student Affairs, JKLU). Guiding young people aged 16–25, parents, and educational institutions with clarity, perspective, and actionable next steps.',
  applicationName: 'Second Innings',
  authors: [{ name: 'Deepak Sogani', url: 'https://second-innings.in/about' }],
  generator: 'Next.js',
  keywords: [
    // Brand & Founder
    'Second Innings',
    'Second Innings mentoring',
    'Second Innings youth platform',
    'Deepak Sogani',
    'Deepak Sogani mentor',
    'Deepak Sogani JKLU',
    'Second Innings Jaipur',
    'second-innings.in',
    // Student Pain Points & Intent
    'career confusion after 12th',
    'what to do after graduation if confused',
    'career guidance for college students',
    'feeling stuck in college career',
    'how to choose the right career path',
    'life guidance for 20 year olds',
    'fear of failure after college',
    'how to build confidence for interviews',
    'finding direction in early 20s',
    'career mentoring vs coaching',
    'peer pressure and career choices',
    'how to talk to parents about career choice',
    'quarter life crisis India',
    'how to find what I am good at',
    // Solutions & Services
    'youth mentoring platform India',
    'one on one student mentoring',
    'career mentorship for teenagers',
    'personal development mentor for students',
    'online mentor for young adults',
    'life transition mentoring',
    'college to corporate transition guidance',
    'human led mentoring',
    'independent career guidance',
    'practical next steps career advice',
    // Parents
    'how to support child career choice',
    'how to talk to teenager about future without arguing',
    'guidance for parents of college students',
    'parent child communication about career',
    'mentor for my teenage son daughter',
    'helping child choose career without pressure',
    'new age careers advice for parents',
    'understanding modern career options India',
    // Institutions
    'student development program for colleges',
    'mentoring programs for higher education institutions',
    'school to university transition workshop',
    'student affairs leadership program',
    'holistic student mentoring pilot',
    'career exposure workshops for schools',
    'student mental clarity and leadership',
    'institution student retention and engagement',
    '90 day student development pilot',
    // Opportunities
    'best fellowships for college graduates India',
    'scholarships for undergraduate students India',
    'how to find genuine internships in college',
    'social impact fellowships India',
    'youth leadership opportunities India',
    'curated student opportunities portal',
    // Local / Geotargeted
    'student mentor in Jaipur',
    'career mentoring in Jaipur',
    'youth counselor mentor Rajasthan',
    'career guidance in Jaipur for students',
    'student development workshops Jaipur',
    'best youth mentor in Rajasthan',
    'online student mentor India',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Deepak Sogani',
  publisher: 'Second Innings',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://second-innings.in',
    languages: {
      'en-IN': 'https://second-innings.in',
    },
  },
  openGraph: {
    title: 'Second Innings | Mentoring Young Minds (Ages 16–25) — Deepak Sogani',
    description:
      'A human-led mentoring and perspective platform for young people navigating education, career choices, and adult life. Founded by Deepak Sogani.',
    url: 'https://second-innings.in',
    siteName: 'Second Innings',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Second Innings — Mentoring Young Minds. New Perspectives. Wider Possibilities.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Second Innings | Mentoring Young Minds (Ages 16–25)',
    description:
      'Navigating what comes next with clarity, not confusion. One-on-one perspective mentoring by Deepak Sogani.',
    creator: '@SecondInningsIN',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '08CBBEF04FF2915E3D43FC9C8CD43BC6',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://second-innings.in/#organization',
      name: 'Second Innings',
      url: 'https://second-innings.in',
      logo: 'https://second-innings.in/logo.png',
      description:
        'A human-led mentoring and perspective platform for young minds aged 16–25, parents, and educational institutions.',
      founder: {
        '@type': 'Person',
        name: 'Deepak Sogani',
        jobTitle: 'Founder & Lead Mentor',
        alumniOf: 'JK Lakshmipat University',
        url: 'https://second-innings.in/about',
        sameAs: ['https://www.linkedin.com/in/deepak-sogani'],
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9314072153',
        contactType: 'customer service',
        email: 'secondinnings136@gmail.com',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
      sameAs: [
        'https://second-innings.in',
        'https://www.linkedin.com/in/deepak-sogani',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://second-innings.in/#website',
      url: 'https://second-innings.in',
      name: 'Second Innings',
      publisher: {
        '@id': 'https://second-innings.in/#organization',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain font-sans antialiased bg-paper text-ink min-h-[100dvh]">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
