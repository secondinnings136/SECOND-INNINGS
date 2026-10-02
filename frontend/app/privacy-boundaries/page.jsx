import Link from 'next/link';

export const metadata = {
  title: 'Privacy, Safety & Professional Boundaries | Second Innings',
  description: 'Second Innings is committed to providing a respectful, responsible and non-judgmental environment for young people.',
};

export default function PrivacyBoundariesPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-12 border-b border-gray-100 pb-8">
          <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Second Innings</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight mb-4">
            Privacy, Safety & Professional Boundaries
          </h1>
          <p className="text-lg text-gray-600">
            A respectful, responsible and non-judgmental environment for young people.
          </p>
        </div>

        {/* Content Body */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-primary mb-3">Our Core Commitment</h2>
            <p>
              Second Innings is committed to providing a respectful, responsible and non-judgmental environment for young people.
              Information shared during conversations is treated with discretion and respect for privacy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary">Confidentiality and Safety</h2>
            <p>
              While personal conversations are kept confidential, confidentiality cannot be absolute.
            </p>
            <p>
              Where there is a reasonable concern involving risk of serious harm, personal safety, abuse, harassment or another situation requiring responsible intervention, appropriate steps may need to be taken. Depending on the circumstances, this could include encouraging or involving a parent/guardian, educational institution, qualified professional or other appropriate support.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary">Professional Scope</h2>
            <p>
              Second Innings is not a medical, psychological, psychiatric, legal or emergency service.
            </p>
            <p>
              Conversations through Second Innings should not be considered a substitute for qualified mental-health counselling, therapy, medical care or other specialist professional services.
            </p>
            <p>
              Where a matter falls outside the scope of Second Innings, the young person will always be encouraged and supported to seek appropriate professional support.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary">Participants Below Age 18</h2>
            <p>
              For participants below the age of 18, appropriate parental/guardian consent and safeguarding requirements will apply.
            </p>
          </section>

          <section className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <h2 className="text-xl font-serif font-bold text-primary mb-2">Why These Boundaries Exist</h2>
            <p className="text-gray-700">
              The purpose of these boundaries is not to restrict conversation, but to ensure that Second Innings remains a safe, responsible and professionally appropriate space.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors text-sm shadow-md"
          >
            Start a Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
