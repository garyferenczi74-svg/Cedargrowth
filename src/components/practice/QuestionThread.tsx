'use client';

import { useState } from 'react';
import type { PracticeMode } from '@/lib/practice/store';
import type { Question, Reply } from '@/lib/practice/questions';
import { PEER_LABEL } from '@/lib/practice/questions';

// The question thread (CG Prompt 09C Section 7). Questions attach to a module and
// bind to the document version they were asked against. An answer comes from the
// operations manager or a designated assessor, never from peer consensus. Peer
// comments render distinct, in the secondary treatment, under the non-guidance
// label. An answered thread whose document version has superseded carries the
// superseded banner until a human reviews it. The answer form carries one
// control: an answer that adds information not in the SOP raises a revision
// finding. There is no general forum: questions attach to modules and nowhere
// else.
//
// Writes go through the store once Practice is provisioned and a person is signed
// in. In preview there is no person and no thread, so the forms are gated and the
// list renders its empty state. Nothing is fabricated.

function AnswerChip() {
  return (
    <span className="inline-block rounded-[2px] border border-pass px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen text-pass">
      Answer
    </span>
  );
}

function ReplyView({ reply, isAnswer }: { reply: Reply; isAnswer: boolean }) {
  if (reply.kind === 'AUTHORITATIVE') {
    return (
      <div className={`flex flex-col gap-1 border-l-2 pl-4 ${isAnswer ? 'border-pass' : 'border-hairline'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-specimen uppercase tracking-specimen text-primary">
            {reply.authorRole === 'OPERATIONS_MANAGER' ? 'Operations manager' : 'Assessor'}
          </span>
          {isAnswer ? <AnswerChip /> : null}
        </div>
        <p className="text-body-m text-primary">{reply.body}</p>
        {reply.addsInformation ? (
          <p className="font-mono text-specimen uppercase tracking-specimen text-attention">
            Raised an SOP revision finding
          </p>
        ) : null}
      </div>
    );
  }
  // Peer comment: secondary treatment, non-guidance label.
  return (
    <div className="flex flex-col gap-1 border-l-2 border-hairline pl-4">
      <p className="text-body-m text-secondary">{reply.body}</p>
      <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{PEER_LABEL}</span>
    </div>
  );
}

export function QuestionThread({
  teaches,
  questions,
  replies,
  mode,
}: {
  teaches: string;
  questions: Question[];
  replies: Reply[];
  mode: PracticeMode;
}) {
  const [draft, setDraft] = useState('');
  const repliesFor = (id: string) => replies.filter((r) => r.questionId === id);

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-heading-m text-primary">Questions</h1>
        <p className="text-body-m md:text-body-l text-secondary">
          Questions attach to this module and bind to the document version it teaches. An answer comes
          from the operations manager or a designated assessor. Peer comments add context and are not
          procedural guidance. An answer that adds information not in the SOP raises a revision finding
          to the operations manager.
        </p>
      </div>

      {/* Ask a question. Bound to the module and the document version. Gated
          until sign in; the draft is local only. */}
      <div className="flex flex-col gap-3 border-t border-hairline pt-6">
        <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
          Ask a question, against {teaches}
        </span>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="min-h-[88px] w-full border border-hairline bg-clinical p-3 text-body-m text-primary focus-visible:outline-cedar"
          placeholder="Your question about this module or the procedure it teaches"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="cg-btn min-h-[44px]" disabled aria-disabled="true">
            Post question
          </button>
          {mode !== 'live' ? (
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              AVAILABLE AFTER SIGN IN
            </span>
          ) : null}
        </div>
      </div>

      {/* The thread. */}
      <div className="flex flex-col gap-6 border-t border-hairline pt-6">
        {questions.length === 0 ? (
          <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">NO QUESTIONS YET</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="flex flex-col gap-3 border-b border-hairline pb-6">
              <div className="flex flex-col gap-1">
                <p className="text-body-l text-primary">{q.body}</p>
                <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                  Asked against {q.documentNumber ?? 'UNKNOWN'} v{q.documentVersion ?? 'UNKNOWN'}
                  {q.answeredReplyId ? ' . answered' : ' . unanswered'}
                </span>
              </div>

              {q.flaggedForReviewOnSupersede ? (
                <div role="alert" className="border border-attention bg-attention/10 p-3 text-attention">
                  <p className="text-body-m">
                    The document version this answer was given against has superseded. The answer is
                    flagged for review, because an answer correct under the earlier version may be wrong
                    now.
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                {repliesFor(q.id).map((r) => (
                  <ReplyView key={r.id} reply={r} isAnswer={q.answeredReplyId === r.id} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
