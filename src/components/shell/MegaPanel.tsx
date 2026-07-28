import Link from 'next/link';
import type { NavItem } from '@/lib/nav';
import { Placeholder } from './Placeholder';

// The single hairline mega panel (Section 5.2). Full width bone panel beneath
// the header hairline, three columns of plain links plus one specimen image,
// 240ms opacity fade, no movement. Keyboard reachable, closes are handled by
// the Header (Escape, outside click, pointer leave).

export function MegaPanel({
  item,
  id,
  onNavigate,
}: {
  item: NavItem;
  id: string;
  onNavigate: () => void;
}) {
  return (
    <div
      id={id}
      role="region"
      aria-label={`${item.label} menu`}
      className="absolute inset-x-0 top-full z-40 animate-fade border-t border-hairline bg-bone motion-reduce:animate-none"
    >
      <div className="mx-auto grid max-w-content grid-cols-4 gap-6 px-page-margin py-12">
        <div className="col-span-3 grid grid-cols-3 gap-6">
          {item.columns?.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="cedar-underline text-body-m text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {item.specimen ? (
          <Placeholder
            family={item.specimen.family}
            alt={item.specimen.alt}
            className="col-span-1 aspect-[4/5]"
          />
        ) : null}
      </div>
    </div>
  );
}
