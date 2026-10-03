import Link from 'next/link';
import Arrow from './Arrow';

/**
 * Editorial button.
 * - variant="primary": ink pill with nested circular arrow (button-in-button).
 * - variant="secondary": hairline pill on paper.
 * - variant="link": underlined text link with arrow.
 * Renders <Link> for internal href, <a> for external/mailto/tel/#, <button> when no href.
 */
export default function Button({
  href,
  variant = 'primary',
  arrow = 'right',
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const base =
    'group inline-flex items-center gap-3 font-medium transition-[transform,background-color,color,border-color] duration-500 ease-editorial active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const styles = {
    primary: 'rounded-full bg-ink text-paper pl-6 pr-1.5 py-1.5 text-[0.9375rem] hover:bg-ink-2',
    secondary: 'rounded-full border border-ink/20 text-ink pl-6 pr-1.5 py-1.5 text-[0.9375rem] hover:border-ink',
    link: 'text-ink text-[0.9375rem] underline decoration-ink/25 underline-offset-[6px] hover:decoration-signal',
  }[variant];

  const content =
    variant === 'link' ? (
      <>
        <span>{children}</span>
        {arrow && <Arrow direction={arrow} className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-0.5" />}
      </>
    ) : (
      <>
        <span>{children}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-px ${
            variant === 'primary' ? 'bg-paper/10 text-paper' : 'bg-ink text-paper'
          }`}
        >
          <Arrow direction={arrow || 'right'} className="h-3.5 w-3.5" />
        </span>
      </>
    );

  const cls = `${base} ${styles} ${className}`;

  if (!href) {
    return (
      <button type={type} className={cls} {...rest}>
        {content}
      </button>
    );
  }

  const external = /^(https?:|mailto:|tel:|#)/.test(href);
  if (external) {
    const isHttp = href.startsWith('http');
    return (
      <a
        href={href}
        className={cls}
        {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
