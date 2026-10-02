import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { getResourceBySlug } from '../../../lib/api';

// This makes the route dynamic in App Router
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) {
    return { title: 'Resource Not Found | Second Innings' };
  }
  return {
    title: `${resource.title} | Second Innings`,
    description: resource.excerpt,
  };
}

export default async function ResourceDetailPage({ params }) {
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Back Link */}
        <Link href="/resources" className="inline-flex items-center text-charcoal-blue font-semibold hover:text-midnight-violet mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 text-golden-pollen group-hover:-translate-x-1 transition-transform" />
          Back to Resources
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-charcoal-blue bg-tea-green/35 border border-tea-green/40 px-3 py-1 rounded-full uppercase tracking-wider">
              {resource.category?.replace(/-/g, ' ')}
            </span>
            {(resource.readingTime || resource.readTime) && (
              <span className="flex items-center text-gray-500 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 mr-1 text-charcoal-blue" />
                {resource.readingTime || resource.readTime} min read
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-charcoal-blue mb-8 leading-tight">
            {resource.title}
          </h1>

          <div className="flex items-center border-t border-b border-slate-100 py-4 text-xs md:text-sm text-gray-600 gap-6">
            {resource.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-charcoal-blue" />
                <span className="font-semibold text-charcoal-blue">{resource.author}</span>
              </div>
            )}
            {resource.createdAt && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-charcoal-blue" />
                <span>{new Date(resource.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />

        {/* Footer CTA */}
        <div className="mt-20 p-8 md:p-10 bg-gradient-to-r from-tea-green/20 via-golden-pollen/15 to-white rounded-3xl border border-tea-green/50 text-center shadow-sm">
          <h3 className="text-2xl font-bold font-serif text-charcoal-blue mb-3">Want to Discuss This Perspective?</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">Let's talk about how these concepts apply to your specific situation and next steps.</p>
          <Link href="/book" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full shadow-md hover:bg-secondary-hover transition-all text-base">
            Start a Conversation →
          </Link>
        </div>
      </article>
    </div>
  );
}
