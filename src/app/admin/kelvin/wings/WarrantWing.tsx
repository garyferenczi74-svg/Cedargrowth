'use client';

import type { KEvent } from '../store';
import {
  DECISIONS,
  DECISION_CLASSES,
  WARRANT_RULES,
  WARRANT_CONFIG,
  COUNTERFACTUAL_METHOD,
  classesWithoutCounterfactual,
} from './warrant';

// The WARRANT wing. Six views over the decision ledger: Overview, Decisions,
// Blocked, Review, Drift, Authority. WARRANT records what authorized an action,
// not the private content underneath it. It supervises the agent. It does not
// see through the agent into people, so nothing a person answered, reflected, or
// acknowledged is reachable from any view here.
//
// The ledger ships empty and no decision source is connected in this build, so
// every computed figure renders UNKNOWN rather than a fabricated zero. The
// Authority view is the exception: the rule set is configuration, not decision
// data, so it renders in full.

type Props = { view: string; addEvent: (e: Omit<KEvent, 'id'>) => void; flash: (m: string) => void; now: () => string };

const CONNECTED = DECISIONS.length > 0;

function Note({ children }: { children: React.ReactNode }) {
  return <p className="lead">{children}</p>;
}

function UnknownPanel({ title, note }: { title: string; note?: string }) {
  return (
    <div className="detailpanel">
      <h3>{title}</h3>
      <div className="empty">UNKNOWN</div>
      {note ? <div className="body" style={{ marginTop: 12, color: 'var(--k-tertiary)', fontSize: 13 }}>{note}</div> : null}
    </div>
  );
}

export default function WarrantWing({ view, addEvent, flash, now }: Props) {
  function exportLedger() {
    // The export writes to the audit chain. In this console the Command feed is
    // that surface, so the export records there. With an empty ledger the export
    // is an honest empty set.
    addEvent({ agent: 'LITMUS', time: now(), type: 'AUDIT', summary: 'WARRANT decision ledger exported', sub: `${String(DECISIONS.length).padStart(2, '0')} decisions. Export recorded to the audit chain.` });
    flash('Export recorded to the audit chain.');
  }

  if (view === 'decisions') {
    return (
      <>
        <Note>
          The full ledger. Filter by agent, class, outcome, reviewed state, and date. A row opens the
          complete warrant record: the authority that permitted it, the inputs the agent could see, the
          alternatives it did not take, the reversibility, and the impact. Records are append only. There
          is no edit or delete path here or in the store. A correction is a new record that cites the one
          it corrects.
        </Note>
        <div className="filters" style={{ marginBottom: 16 }}>
          {DECISION_CLASSES.map((c) => (
            <span key={c} className="pill" style={{ cursor: 'default' }}>{c}</span>
          ))}
        </div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr>
            <th scope="col">Decision</th><th scope="col">Agent</th><th scope="col">Class</th>
            <th scope="col">Outcome</th><th scope="col">Authority</th><th scope="col">Impact</th><th scope="col">Reviewed</th>
          </tr></thead>
          <tbody>
            {CONNECTED ? DECISIONS.map((d) => (
              <tr key={d.id}>
                <td className="mono">{d.id}</td><td className="mono">{d.agent}</td><td className="mono">{d.klass}</td>
                <td>{d.outcome}</td><td className="mono">{d.authority}</td><td className="mono">{String(d.impactCount).padStart(2, '0')}</td><td>{d.reviewState}</td>
              </tr>
            )) : (
              <tr><td colSpan={7}><div className="empty">No decisions recorded. No decision source is connected in this build.</div></td></tr>
            )}
          </tbody>
        </table></div>
        <div className="actions" style={{ marginTop: 16 }}>
          <button className="btn" onClick={exportLedger}>Export CSV</button>
          <span style={{ color: 'var(--k-tertiary)', fontSize: 12 }}>The export is recorded to the audit chain.</span>
        </div>
      </>
    );
  }

  if (view === 'blocked') {
    return (
      <>
        <Note>
          Every attempt an agent made that the store refused, with the rule that refused it. This has its
          own view, not a filter on Decisions, because it is the one to open first. An agent reaching for
          authority it does not have is the single most important signal an oversight system can surface.
        </Note>
        <UnknownPanel
          title="Blocked attempts"
          note={`No decision source is connected in this build, so this renders UNKNOWN. An empty blocked view across months is evidence the authority envelope holds. A blocked view that starts filling is the earliest warning that something changed in how an agent reasons, and it arrives before any harm does. ${WARRANT_CONFIG.blockAlertCount} blocks against one rule within ${WARRANT_CONFIG.blockAlertWindowDays} days raise an ALERT to the live feed.`}
        />
      </>
    );
  }

  if (view === 'review') {
    return (
      <>
        <Note>
          The forcing function. Each week presents the drawn sample plus every high impact decision. The
          reviewer marks each as sound, questionable, or wrong, with a required note on anything not sound.
          Signing the week requires a named human and writes to the audit chain. Unsigned weeks accumulate
          on the Overview and never clear themselves.
        </Note>
        <div className="kpis">
          <div className="kpi"><div className="k">Sample size</div><div className="v mono">{String(WARRANT_CONFIG.weeklySampleSize).padStart(2, '0')}</div><div className="m">routine decisions per week, configured</div></div>
          <div className="kpi"><div className="k">High impact</div><div className="v mono">&gt;{WARRANT_CONFIG.highImpactPeople}</div><div className="m">people, or IRREVERSIBLE. Always reviewed</div></div>
          <div className="kpi"><div className="k">This week</div><div className="v">UNKNOWN</div><div className="m">no source connected</div></div>
        </div>
        <UnknownPanel
          title="Weekly review"
          note="The sample is drawn by the system, with its seed and size recorded, so the review cannot be gamed by choosing comfortable rows. Signing is available once a decision source and a named reviewer are connected. The reviewer who signs the week is not the person who configures the rules."
        />
      </>
    );
  }

  if (view === 'drift') {
    return (
      <>
        <Note>
          Per agent and per decision class, volume over time against its own trailing baseline. A shift
          beyond threshold renders UNEXPLAINED until a human attaches an explanation, which then becomes
          part of the record. The method is a plain trailing average over {WARRANT_CONFIG.driftBaselineDays} days
          and a stated threshold, not a statistical significance figure that cannot be justified.
        </Note>
        <UnknownPanel
          title="Drift by agent and class"
          note="No decision source is connected in this build, so drift renders UNKNOWN. If APEX reassigned four items a week for three months and reassigns sixty this week, something changed: an SOP version, a rule, a data condition, or the agent. WARRANT flags the shift and names it UNEXPLAINED until a human attaches the reason."
        />
      </>
    );
  }

  if (view === 'authority') {
    const permits = WARRANT_RULES.filter((r) => r.kind === 'PERMIT');
    const bars = WARRANT_RULES.filter((r) => r.kind === 'BAR');
    return (
      <>
        <Note>
          The rule set as data. Every rule an agent can cite as authority, what it permits, and which agent
          holds it. Rules that bar an action are shown alongside rules that permit one, so the reader sees
          the full envelope rather than only what was allowed.
        </Note>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Rule</th><th scope="col">Agent</th><th scope="col">Kind</th><th scope="col">Permits or bars</th></tr></thead>
          <tbody>
            {permits.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td><td className="mono">{r.agent}</td>
                <td><span className="chip pass"><span className="sq pass" />PERMIT</span></td>
                <td style={{ color: 'var(--k-secondary)' }}>{r.permits}</td>
              </tr>
            ))}
            {bars.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td><td className="mono">{r.agent}</td>
                <td><span className="chip fail"><span className="sq fail" />BAR</span></td>
                <td style={{ color: 'var(--k-secondary)' }}>{r.permits}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className="privacy" style={{ marginTop: 18 }}>
          Enforcement rules are not editable in this build. Changes route through the operations manager and
          counsel. APEX has no write access to WARRANT beyond emitting its own decision records, and LITMUS
          runs a monthly review of WARRANT itself: whether every executed decision carried a valid authority,
          whether any decision executed without a matching rule, whether any cited rule does not exist, and
          whether the weekly reviews actually happened. An agent grading its own oversight is not oversight.
        </div>
      </>
    );
  }

  // overview (default)
  const noMethod = classesWithoutCounterfactual();
  return (
    <>
      <Note>
        WARRANT records and reviews the decisions the agents make on their own, APEX first. Unsigned review
        weeks lead, because an oversight wing nobody signs is theatre. No decision source is connected in this
        build, so the figures below render UNKNOWN rather than a zero that would read as a real measurement.
      </Note>

      {/* Unsigned review weeks: first and largest. It does not collapse or hide. */}
      <div className="detailpanel" style={{ border: '1px solid var(--k-attention)', marginBottom: 24 }}>
        <h3 style={{ color: 'var(--k-attention)' }}>Unsigned review weeks</h3>
        <div className="empty">UNKNOWN</div>
        <div className="body" style={{ marginTop: 12, color: 'var(--k-tertiary)', fontSize: 13 }}>
          Unsigned weeks accumulate here and never clear themselves. Signing a week requires a named human
          and writes to the audit chain.
        </div>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="k">Blocked, 30 days</div><div className="v">UNKNOWN</div><div className="m">attempts the store refused</div></div>
        <div className="kpi"><div className="k">Unexplained drift</div><div className="v">UNKNOWN</div><div className="m">shifts awaiting a reason</div></div>
        <div className="kpi"><div className="k">Decision volume</div><div className="v">UNKNOWN</div><div className="m">by agent and class</div></div>
      </div>

      <div className="detailpanel" style={{ marginTop: 24 }}>
        <h3>Counterfactual, by decision class</h3>
        <div className="body" style={{ marginBottom: 12, color: 'var(--k-tertiary)', fontSize: 13 }}>
          For each class, what would have happened with no agent acting. This is the only defensible answer
          to whether the automation earns its place, so where it cannot be computed honestly it renders
          UNKNOWN, and an invented number here is worse than an absent one.
        </div>
        {DECISION_CLASSES.map((c) => {
          const method = COUNTERFACTUAL_METHOD[c];
          return (
            <div className="keyfield" key={c}>
              <span className="kf-k mono" style={{ color: 'var(--k-secondary)' }}>{c}</span>
              <span className="kf-v" style={{ color: 'var(--k-tertiary)', fontSize: 13 }}>
                {method ? `${method} Value UNKNOWN, no source connected.` : 'METHOD NOT DEFINED'}
              </span>
            </div>
          );
        })}
        {noMethod.length ? (
          <div className="body" style={{ marginTop: 12, color: 'var(--k-attention)', fontSize: 12 }}>
            Classes with no counterfactual method defined: {noMethod.join(', ')}.
          </div>
        ) : null}
      </div>
    </>
  );
}
