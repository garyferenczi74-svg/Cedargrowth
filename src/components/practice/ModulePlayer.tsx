'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ContentBlock, Module } from '@/lib/practice/modules';
import { StatusChip } from './DocElements';

// The module player (CG Prompt 09C Section 5). Single purpose: title, the
// document and version it teaches in mono, a plain hairline progress indicator
// rather than a percentage bar, and one primary action. No sidebar, no chrome.
// Tablet first: one column, 720px text measure, 44px minimum touch targets, and
// no hover-dependent interaction. Progress saving and playback verification wire
// to the store and the video provider when those are provisioned; here the
// player renders the block sequence and the resume and completion treatments.

function teachesLine(m: Module): string {
  if (m.teaches.kind === 'DOCUMENT') return `${m.teaches.documentNumber} v${m.teaches.version}`;
  if (m.teaches.kind === 'PENDING') return 'Document number pending';
  return 'Teaches no controlled document';
}

function Pending({ text }: { text: string }) {
  return <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{text}</span>;
}

function BlockView({ block, teaches }: { block: ContentBlock; teaches: string }) {
  if (block.type === 'TEXT') {
    return block.contentRef ? (
      <p className="text-body-l text-secondary">{block.contentRef}</p>
    ) : (
      <Pending text="TEXT PENDING SOURCE" />
    );
  }
  if (block.type === 'DOCUMENT_EXCERPT') {
    return (
      <div className="flex flex-col gap-3 border border-hairline bg-parchment p-6">
        <span className="font-mono text-data uppercase tracking-specimen text-primary">
          {block.documentNumber} v{block.version}
          {block.sectionRef ? ` . ${block.sectionRef}` : ''}
        </span>
        <Pending text="PULLED LIVE FROM THE DOCUMENT RECORD. UNKNOWN PENDING SOURCE" />
      </div>
    );
  }
  if (block.type === 'VIDEO') {
    return (
      <div className="flex flex-col gap-3 border border-hairline bg-parchment p-6">
        <Pending text="VIDEO PENDING A PROVIDER" />
        <p className="text-body-m text-secondary">
          Playback verified completion turns on when the video provider is connected. This block
          completes at {block.completionPercent} percent watched, and seeking past unwatched content
          does not count.
        </p>
      </div>
    );
  }
  if (block.type === 'IMAGE') {
    return (
      <div className="flex flex-col gap-2">
        <div className="border border-hairline bg-parchment p-6">
          <Pending text={block.imageRef ? 'IMAGE' : 'IMAGE PENDING SOURCE'} />
        </div>
        <span className="text-body-m text-secondary">{block.alt}</span>
        {block.caption ? <span className="text-caption text-tertiary">{block.caption}</span> : null}
      </div>
    );
  }
  if (block.type === 'CHECKPOINT') {
    return (
      <div className="flex flex-col gap-2 border-l-2 border-calm pl-4">
        <span className="font-mono text-specimen uppercase tracking-specimen text-calm">Checkpoint</span>
        {block.prompt ? (
          <p className="text-body-l text-secondary">{block.prompt}</p>
        ) : (
          <Pending text="CHECKPOINT PENDING" />
        )}
        <span className="text-caption text-tertiary">This holds attention. It is not scored and not recorded.</span>
      </div>
    );
  }
  // ACKNOWLEDGMENT
  return (
    <div className="flex flex-col gap-2 border border-hairline bg-clinical p-6">
      <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Acknowledgment</span>
      <p className="text-body-m text-secondary">Bound to {teaches}, not to this module.</p>
      <Pending text="AVAILABLE AFTER SIGN IN" />
    </div>
  );
}

export function ModulePlayer({ module, startAt = 0 }: { module: Module; startAt?: number }) {
  const blocks = module.blocks;
  const total = blocks.length;
  const [index, setIndex] = useState(Math.min(startAt, Math.max(total - 1, 0)));
  const [done, setDone] = useState(false);
  const teaches = teachesLine(module);
  const superseded = module.status === 'SUPERSEDED' || module.status === 'WITHDRAWN';

  const Header = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-data uppercase tracking-specimen text-primary">{module.id}</span>
        <StatusChip status={module.status} />
        {module.source === 'EXTERNAL_PACKAGE' ? (
          <span className="rounded-[2px] border border-hairline px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen text-tertiary">
            External
          </span>
        ) : null}
      </div>
      <h1 className="font-display text-heading-m text-primary">{module.title ?? 'UNKNOWN'}</h1>
      <span className="font-mono text-data text-secondary">{teaches}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-clinical">
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-page-margin-mobile py-10 md:px-page-margin">
        {Header}

        {superseded ? (
          <div role="alert" className="border border-attention bg-attention/10 p-4 text-attention">
            <p className="text-body-m">
              This module is superseded because the document it teaches has a newer current version. It
              is retained for record purposes and must not be used to train.
            </p>
          </div>
        ) : null}

        {module.status === 'DRAFT' ? (
          <div className="border border-hairline bg-parchment p-4">
            <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              DRAFT. Not published, not assignable. A named human approves it before it can be assigned.
            </p>
          </div>
        ) : null}

        {total === 0 ? (
          <div className="border-t border-hairline pt-8">
            <Pending text="NO CONTENT BLOCKS YET" />
            <p className="mt-3 text-body-m text-secondary">
              A manager authors the content in the module builder. The player renders the blocks in
              order once they exist.
            </p>
          </div>
        ) : done ? (
          // Completion screen. Module, document and version, timestamp, and what
          // is next. No congratulation.
          <div className="flex flex-col gap-4 border-t border-hairline pt-8">
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Completed</span>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-data text-primary">{module.id}</span>
              <span className="font-mono text-data text-secondary">{teaches}</span>
            </div>
            <Pending text="COMPLETION RECORDS ON SIGN IN. TIMESTAMP IS THE TRUE COMPLETION TIME" />
            <Link href="/practice/modules" className="cg-btn mt-2 min-h-[44px] self-start">
              Back to modules
            </Link>
          </div>
        ) : (
          <>
            {/* Plain hairline progress: one segment per block, filled to the
                current block. Not a percentage bar. */}
            <div className="flex items-center gap-2" aria-label={`Block ${index + 1} of ${total}`}>
              {blocks.map((b, i) => (
                <span
                  key={b.id}
                  className={`h-[3px] flex-1 ${i <= index ? 'bg-primary' : 'bg-hairline'}`}
                />
              ))}
            </div>
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              {startAt > 0 && index === startAt ? `Resumed at block ${index + 1} of ${total}` : `Block ${index + 1} of ${total}`}
            </span>

            <div className="border-t border-hairline pt-8">
              <BlockView block={blocks[index]} teaches={teaches} />
            </div>

            <div className="border-t border-hairline pt-6">
              <button
                type="button"
                className="cg-btn min-h-[52px] w-full sm:w-auto"
                onClick={() => {
                  // Progress saves on every block through the store when
                  // provisioned; here it advances the player. The last block
                  // moves to the completion screen.
                  if (index + 1 < total) setIndex(index + 1);
                  else setDone(true);
                }}
              >
                {index + 1 < total ? 'Continue' : 'Complete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
