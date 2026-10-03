import { Reveal, RevealGroup, RevealItem } from './Reveal';

/**
 * Shared interior-page hero: mono meta row, large serif H1, lede, hairline rule.
 * `meta` is an array of short strings (e.g. ['For students', 'Ages 16 to 25']).
 */
export default function PageHero({ meta = [], title, lede, children, className = '' }) {
  return (
    <section className={`page-x pt-36 md:pt-48 pb-16 md:pb-24 ${className}`}>
      <RevealGroup>
        {meta.length > 0 && (
          <RevealItem className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {meta.map((m, i) => (
              <span key={i} className="meta flex items-center gap-6">
                {i > 0 && <span aria-hidden="true" className="h-px w-6 bg-line" />}
                {m}
              </span>
            ))}
          </RevealItem>
        )}
        <RevealItem
          as="h1"
          className="max-w-[78rem] font-serif text-[clamp(2.75rem,5.4vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-ink"
        >
          {title}
        </RevealItem>
        {lede && (
          <RevealItem as="p" className="lede mt-8 md:mt-10 text-[1.125rem] md:text-[1.1875rem]">
            {lede}
          </RevealItem>
        )}
        {children && <RevealItem className="mt-10">{children}</RevealItem>}
      </RevealGroup>
      <Reveal className="mt-16 md:mt-24 h-px w-full bg-line" />
    </section>
  );
}
