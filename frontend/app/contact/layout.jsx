export const metadata = {
  title: 'Contact | Get in Touch — Second Innings',
  description:
    'Reach Deepak Sogani at Second Innings. Email: secondinnings136@gmail.com | WhatsApp: +91 77372 20724. Based in Jaipur, Rajasthan, serving young people pan-India.',
  keywords: [
    'contact Second Innings',
    'Deepak Sogani contact',
    'student conversation inquiries',
    'institutional partnerships schools colleges',
    'Jaipur Rajasthan',
    'reach out to Second Innings',
  ],
  alternates: {
    canonical: 'https://second-innings.in/contact',
  },
  openGraph: {
    title: 'Contact — Second Innings',
    description:
      'We welcome inquiries from students, parents, schools, and colleges. Start a conversation with us.',
    url: 'https://second-innings.in/contact',
  },
};

export default function ContactLayout({ children }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://second-innings.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: 'https://second-innings.in/contact',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
