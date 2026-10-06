export const metadata = {
  title: 'About Deepak Sogani | Founder, Second Innings',
  description:
    'Meet Deepak Sogani: 35+ years across corporate leadership, entrepreneurship, and higher education. Dedicated to listening, perspective, and youth development.',
  keywords: [
    'Deepak Sogani',
    'Deepak Sogani mentor',
    'Deepak Sogani JKLU',
    'Second Innings founder',
    'corporate to mentorship journey',
    'student mentor Jaipur',
    'youth guidance Deepak Sogani',
  ],
  alternates: {
    canonical: 'https://second-innings.in/about',
  },
  openGraph: {
    title: 'About Deepak Sogani — Second Innings',
    description:
      '35+ years across corporate life, entrepreneurship and higher education. Dedicated to bringing perspective and possibilities to young people.',
    url: 'https://second-innings.in/about',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Deepak Sogani | Second Innings',
    description:
      '35+ years across corporate life, entrepreneurship and higher education. Dedicated to bringing perspective to the next generation.',
  },
};

export default function AboutLayout({ children }) {
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://second-innings.in/about#deepaksogani',
      name: 'Deepak Sogani',
      jobTitle: 'Founder',
      worksFor: {
        '@type': 'EducationalOrganization',
        name: 'Second Innings',
        url: 'https://second-innings.in',
      },
      image: 'https://second-innings.in/deepaksogani.jpeg',
      description:
        '35+ Years Across Corporate Life, Entrepreneurship & Higher Education. Dedicated to helping young people aged 16–25 explore possibilities and choose their own next step.',
      email: 'secondinnings136@gmail.com',
      telephone: '+91 77372 20724',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://www.linkedin.com/in/deepak-sogani/',
        'https://second-innings.in/about',
      ],
      knowsAbout: [
        'Youth Development',
        'Student Affairs',
        'Career Exploration',
        'Higher Education Transitions',
        'Leadership Mentoring',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      {children}
    </>
  );
}
