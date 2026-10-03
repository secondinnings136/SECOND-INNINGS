/** Mono metadata label. Use only when it carries real information. */
export default function Meta({ as: Tag = 'p', className = '', children }) {
  return <Tag className={`meta ${className}`}>{children}</Tag>;
}
