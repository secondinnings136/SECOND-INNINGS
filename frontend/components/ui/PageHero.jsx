import { Reveal, RevealGroup, RevealItem } from './Reveal';
import Breadcrumbs from './Breadcrumbs';

/**
 * Shared interior-page hero: optional breadcrumbs, mono meta row, large serif H1, lede, hairline rule.
 * `meta` is an array of short strings (e.g. ['For students', 'Ages 16 to 25']).
 * `breadcrumbs` is an optional array of { name: string, href?: string }.
 */
export default function PageHero({
  breadcrumbs,
  meta = [],
  title,
  lede,
  children,
  className = '',
}) {
  return (
    <section className={`page-x pt-20 sm:pt-28 md:pt-36 pb-10 sm:pb-14 md:pb-20 ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <RevealGroup>
        {meta.length > 0 && (
          <RevealItem className="mb-5 sm:mb-8 flex flex-wrap items-center gap-x-3 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
            {meta.map((m, i) => (
              <span key={i} className="meta flex items-center gap-3 sm:gap-6 text-[0.625rem] sm:text-[0.6875rem]">
                {i > 0 && <span aria-hidden="true" className="h-px w-3 sm:w-6 bg-line select-none" />}
                {m}
              </span>
            ))}
          </RevealItem>
        )}
        <RevealItem
          as="h1"
          className="max-w-[78rem] font-serif text-[clamp(2.1rem,5.5vw,5.5rem)] leading-[1.06] sm:leading-[1] md:leading-[0.95] tracking-[-0.02em] text-ink break-words"
        >
          {title}
        </RevealItem>
        {lede && (
          <RevealItem as="p" className="lede mt-5 sm:mt-8 md:mt-10 text-[0.9375rem] sm:text-[1.125rem] md:text-[1.1875rem]">
            {lede}
          </RevealItem>
        )}
        {children && <RevealItem className="mt-6 sm:mt-10">{children}</RevealItem>}
      </RevealGroup>
      <Reveal className="mt-10 sm:mt-16 md:mt-24 h-px w-full bg-line" />
    </section>
  );
}
