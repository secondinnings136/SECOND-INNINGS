/** Section heading block: optional meta, serif H2, optional lede. */
import { RevealGroup, RevealItem } from './Reveal';

export default function SectionHead({ meta, title, lede, className = '', titleClassName = '' }) {
  return (
    <RevealGroup className={className}>
      {meta && <RevealItem as="p" className="meta mb-4 sm:mb-6">{meta}</RevealItem>}
      <RevealItem
        as="h2"
        className={`max-w-[22ch] font-serif text-[clamp(1.85rem,4.5vw,3.75rem)] leading-[1.08] sm:leading-[1] tracking-[-0.02em] text-ink ${titleClassName}`}
      >
        {title}
      </RevealItem>
      {lede && <RevealItem as="p" className="lede mt-4 sm:mt-6">{lede}</RevealItem>}
    </RevealGroup>
  );
}
