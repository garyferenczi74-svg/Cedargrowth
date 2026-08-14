'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Placeholder } from '@/components/shell/Placeholder';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { FrameWipe } from '@/components/motion/FrameWipe';
import { PRODUCTS, FORMAT_GROUPS, type Product } from '@/lib/products';

// The Products index (CG Prompt 11). Two composing chip rows filter by line and
// by input. An active filter narrows the groups rather than reordering them, and
// a product whose line or input is UNKNOWN is excluded from a filtered view
// rather than guessed into one. Each entry renders name plus a mono specimen
// block; no descriptor is written here (they are supplied), no price, no cart,
// no per-entry action. Entries link to their detail page, which is a real route.

const LINE_FILTERS = ['REST', 'RELIEF', 'FOCUS', 'CALM', 'RESTORE'] as const;
const INPUT_FILTERS = ['CURED TRIM', 'FRESH FROZEN'] as const;

function chipClass(on: boolean): string {
  return `rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen transition-colors duration-hover ease-cedar focus-visible:outline-cedar ${
    on
      ? 'border-ink bg-ink text-bone'
      : 'border-secondary text-tertiary hover:border-ink hover:bg-ink hover:text-bone'
  }`;
}

function SpecRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="min-w-[5.5rem] font-mono text-specimen uppercase tracking-specimen text-tertiary">
        {label}
      </dt>
      <dd
        className={`font-mono text-specimen uppercase tracking-specimen ${
          value ? 'text-secondary' : 'text-tertiary'
        }`}
      >
        {value ?? 'UNKNOWN'}
      </dd>
    </div>
  );
}

function Entry({ product, index }: { product: Product; index: number }) {
  return (
    <li>
      <RuleDraw axis="x" className="mb-6 h-px w-full origin-left bg-hairline" />
      <Link href={`/products/${product.slug}`} className="group block">
        <FrameWipe delay={index * 0.08}>
          <Placeholder
            family="specimen plate"
            alt={`Placeholder, specimen plate of ${product.name}`}
            className="aspect-[4/5]"
            label={false}
          />
        </FrameWipe>
        <h3 className="mt-4 font-display text-heading-s-m md:text-heading-s text-primary">
          {product.name}
        </h3>
        <dl className="mt-3 flex flex-col gap-1.5">
          <SpecRow label="Line" value={product.line} />
          <SpecRow label="Input" value={product.input} />
          <SpecRow label="Format" value={product.spec} />
          <SpecRow label="Terpenes" value={product.terpenes} />
        </dl>
      </Link>
    </li>
  );
}

export function ProductsGrid() {
  const [lines, setLines] = useState<Set<string>>(new Set());
  const [inputs, setInputs] = useState<Set<string>>(new Set());

  const toggle = (
    set: Set<string>,
    setSet: (s: Set<string>) => void,
    value: string,
  ) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setSet(next);
  };

  const filtering = lines.size > 0 || inputs.size > 0;

  const matches = (p: Product): boolean => {
    if (lines.size > 0 && !(p.line && lines.has(p.line.toUpperCase()))) return false;
    if (inputs.size > 0 && !(p.input && inputs.has(p.input.toUpperCase()))) return false;
    return true;
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Two composing chip rows */}
      <div className="flex flex-col gap-4">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by line"
        >
          <span className="mr-2 font-mono text-specimen uppercase tracking-specimen text-tertiary">
            Line
          </span>
          {LINE_FILTERS.map((f) => {
            const on = lines.has(f);
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(lines, setLines, f)}
                className={chipClass(on)}
              >
                {f}
              </button>
            );
          })}
        </div>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by input"
        >
          <span className="mr-2 font-mono text-specimen uppercase tracking-specimen text-tertiary">
            Input
          </span>
          {INPUT_FILTERS.map((f) => {
            const on = inputs.has(f);
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(inputs, setInputs, f)}
                className={chipClass(on)}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Three format groups, in the fixed order. Filtering narrows entries
          within each group; groups keep their place. */}
      {FORMAT_GROUPS.map((group) => {
        const all = PRODUCTS.filter((p) => p.format === group.format);
        const shown = all.filter(matches);
        return (
          <section key={group.format} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                {group.label === 'Vape'
                  ? 'Vapes'
                  : group.label === 'Infused pre-roll'
                    ? 'Infused pre-rolls'
                    : 'Gummies'}
              </h2>
              <RuleDraw axis="x" className="h-px w-full origin-left bg-hairline" />
            </div>
            {shown.length > 0 ? (
              <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
                {shown.map((product, i) => (
                  <Entry key={product.slug} product={product} index={i} />
                ))}
              </ul>
            ) : (
              <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                {filtering
                  ? 'No products carry this filter yet'
                  : 'None'}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
