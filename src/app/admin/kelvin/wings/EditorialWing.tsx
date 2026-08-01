'use client';

import { useCallback, useEffect, useState } from 'react';
import { STAGES, stageIndex, type Draft, type EditorialData } from './editorial';
import type { KEvent } from '../store';

// The Editorial wing, backed by Supabase. Data from /api/admin/kelvin/editorial;
// clearance (dictionary scan), approval, schedule, and publish persist through
// the gated mutate route where the chain is enforced. Actions refetch and emit
// events into the Command feed.

type Props = { view: string; addEvent: (e: Omit<KEvent, 'id'>) => void; flash: (m: string) => void; now: () => string };

function stageChip(s: string) {
  if (s === 'Published' || s === 'Approved' || s === 'Cleared') return <span className="chip pass"><span className="sq pass" />{s}</span>;
  if (s === 'Scheduled' || s === 'In clearance') return <span className="chip attention"><span className="sq attention" />{s}</span>;
  return <span className="chip" style={{ color: 'var(--k-secondary)' }}>{s}</span>;
}
function scanChip(scan: string) {
  if (scan === 'flagged') return <span className="chip fail"><span className="sq fail" />Scan flagged</span>;
  return <span className="chip pass"><span className="sq pass" />Scan clean</span>;
}
function ChainStepper({ stage }: { stage: string }) {
  const cur = stageIndex(stage);
  return (
    <div className="stepper">
      {STAGES.map((s, i) => (
        <span key={s} style={{ display: 'contents' }}>
          <span className={`step ${i < cur ? 'done' : i === cur ? 'current' : ''}`}><span className="dot" />{s}</span>
          {i < STAGES.length - 1 ? <span className="step-sep" /> : null}
        </span>
      ))}
    </div>
  );
}

export default function EditorialWing({ view, addEvent, flash, now }: Props) {
  const [data, setData] = useState<EditorialData | null>(null);
  const [selDraft, setSelDraft] = useState<string | null>(null);
  const [dates, setDates] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try { const r = await fetch('/api/admin/kelvin/editorial'); if (r.ok) setData(await r.json()); } catch { /* keep */ }
  }, []);
  useEffect(() => { load(); }, [load]);

  const mutate = useCallback(async (payload: Record<string, unknown>): Promise<Record<string, unknown>> => {
    try {
      const r = await fetch('/api/admin/kelvin/editorial/mutate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      return await r.json().catch(() => ({ ok: false }));
    } catch { return { ok: false }; }
  }, []);

  async function clear(id: string) {
    const res = await mutate({ op: 'clear', id });
    if (res.ok) { addEvent({ agent: 'SENTINEL', time: now(), type: 'GATE', summary: `Cleared: ${res.title}`, sub: `Draft ${id} passed originality and the dictionary scan. Passed to owner approval.` }); await load(); flash(`Cleared ${id}.`); }
    else flash((res.reason as string) || 'Blocked.');
  }
  async function sendBack(id: string) {
    await mutate({ op: 'sendback', id });
    addEvent({ agent: 'APERTURE', time: now(), type: 'DRAFT', summary: `Sent back to draft: ${id}`, sub: 'Returned to APERTURE for revision.' });
    await load(); flash(`Sent ${id} back to draft.`);
  }
  async function approve(id: string) {
    const res = await mutate({ op: 'approve', id });
    if (res.ok) { addEvent({ agent: 'MERIDIAN', time: now(), type: 'DECISION', summary: `Owner approved: ${res.title}`, sub: `Draft ${id} approved. Ready to schedule.` }); await load(); flash(`Approved ${id}.`); }
    else flash((res.reason as string) || 'Blocked.');
  }
  async function schedule(id: string) {
    const raw = dates[id] || '';
    const date = raw ? raw.slice(5) : '';
    const res = await mutate({ op: 'schedule', id, date });
    if (res.ok) { addEvent({ agent: 'APERTURE', time: now(), type: 'DRAFT', summary: `Scheduled: ${res.title}`, sub: `Draft ${id} scheduled to publish ${res.pubDate}.` }); await load(); flash(`Scheduled ${id} for ${res.pubDate}.`); }
    else flash((res.reason as string) || 'Blocked.');
  }
  async function publish(id: string) {
    const res = await mutate({ op: 'publish', id });
    if (res.ok) { addEvent({ agent: 'APERTURE', time: now(), type: 'DRAFT', summary: `Published: ${res.title}`, sub: `Draft ${id} is live in the research index.` }); await load(); flash(`Published ${id}.`); }
    else flash((res.reason as string) || 'Blocked.');
  }
  async function promote(id: string) {
    const res = await mutate({ op: 'promote', id });
    if (res.ok && res.draft) { const nd = res.draft as { id: string; title: string }; addEvent({ agent: 'APERTURE', time: now(), type: 'DRAFT', summary: `Draft opened: ${nd.title}`, sub: `Promoted from research ${id} into ${nd.id}.` }); await load(); flash(`Opened draft ${nd.id}.`); }
    else flash((res.reason as string) || 'Blocked.');
  }

  if (!data) return <div className="empty">Loading Editorial data.</div>;
  const drafts = data.drafts;

  if (view === 'overview') {
    const counts: Record<string, number> = {};
    STAGES.forEach((s) => { counts[s] = 0; });
    drafts.forEach((d) => { counts[d.stage] = (counts[d.stage] || 0) + 1; });
    const upcoming = drafts.filter((d) => d.stage === 'Scheduled');
    const live = drafts.filter((d) => d.stage === 'Published');
    return (
      <>
        <p className="lead">The editorial pipeline. APERTURE drafts, SENTINEL clears, the owner approves, then schedule and publish. Every stage is a gate.</p>
        <div className="kpis">
          <div className="kpi"><div className="k">In clearance</div><div className="v">{String(counts['In clearance']).padStart(2, '0')}</div><div className="m">SENTINEL queue</div></div>
          <div className="kpi"><div className="k">Awaiting approval</div><div className="v">{String(counts['Cleared']).padStart(2, '0')}</div><div className="m">owner queue</div></div>
          <div className="kpi"><div className="k">Scheduled</div><div className="v">{String(counts['Scheduled']).padStart(2, '0')}</div><div className="m">queued to publish</div></div>
          <div className="kpi"><div className="k">Published</div><div className="v">{String(counts['Published']).padStart(2, '0')}</div><div className="m">live</div></div>
        </div>
        <div className="two-col">
          <div className="col"><h2>Upcoming schedule</h2>
            {upcoming.length ? upcoming.map((x) => <div className="alert-row" key={x.id}><span className="stripe" style={{ background: 'var(--k-editorial)' }} /><div className="body"><div className="a-sub">{x.pubDate} . {x.id}</div><div className="a-det">{x.title}</div></div></div>) : <div className="empty">Nothing scheduled.</div>}
          </div>
          <div className="col"><h2>Recently published</h2>
            {live.map((x) => <div className="alert-row" key={x.id}><span className="stripe" style={{ background: 'var(--k-hairline)' }} /><div className="body"><div className="a-sub">{x.pubDate} . {x.id}</div><div className="a-det">{x.title}</div></div></div>)}
          </div>
        </div>
      </>
    );
  }

  if (view === 'research') {
    return (
      <>
        <p className="lead">Research feeds the drafts, often handed off from the scraping intelligence. Promote a note to open a draft for APERTURE.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Note</th><th scope="col">Topic</th><th scope="col">Source</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
          <tbody>{data.research.map((r) => (
            <tr key={r.id}><td className="mono">{r.id}</td><td>{r.topic}</td><td>{r.source}</td><td><span className="chip" style={{ color: r.status === 'Open' ? 'var(--k-attention)' : 'var(--k-tertiary)' }}>{r.status}</span></td><td>{r.status === 'Open' ? <button className="btn" onClick={() => promote(r.id)}>Promote to draft</button> : <span style={{ color: 'var(--k-tertiary)', fontSize: 12 }}>In draft</span>}</td></tr>
          ))}</tbody>
        </table></div>
      </>
    );
  }

  if (view === 'clearance') {
    const rows = drafts.filter((x) => x.stage === 'In clearance');
    return (
      <>
        <p className="lead">SENTINEL clearance. Originality and the dictionary scan. A single banned term is a hard block, so a flagged draft cannot clear.</p>
        {rows.length ? rows.map((x) => (
          <div className="item" key={x.id}>
            <h3>{x.title}</h3>
            <div className="from mono">{x.id} . {x.author} . {x.scan === 'flagged' ? 'scan flagged' : 'scan clean'}</div>
            <div className="body" style={{ color: x.flag ? 'var(--k-fail)' : undefined }}>{x.flag ? x.flag : 'Originality check pending owner. Copy scanned clean against the banned dictionary.'}</div>
            <div className="actions">
              {x.scan === 'flagged'
                ? <button className="btn disabled" onClick={() => flash(`Draft ${x.id} has a dictionary scan hit. A single banned term is a hard block. Fix the copy before it can clear.`)}>Clear</button>
                : <button className="btn solid" onClick={() => clear(x.id)}>Clear</button>}
              <button className="btn" onClick={() => sendBack(x.id)}>Send back to draft</button>
            </div>
          </div>
        )) : <div className="empty">Nothing in clearance.</div>}
      </>
    );
  }

  if (view === 'approval') {
    const rows = drafts.filter((x) => x.stage === 'Cleared');
    return (
      <>
        <p className="lead">Owner approval. Cleared drafts wait here. Approval is the owner gate before a piece can be scheduled.</p>
        {rows.length ? rows.map((x) => (
          <div className="item" key={x.id}>
            <h3>{x.title}</h3>
            <div className="from mono">{x.id} . {x.author} . cleared by SENTINEL</div>
            <div className="body">Cleared and ready. Approving moves it to scheduling.</div>
            <div className="actions"><button className="btn solid" onClick={() => approve(x.id)}>Approve</button><button className="btn" onClick={() => sendBack(x.id)}>Send back to draft</button></div>
          </div>
        )) : <div className="empty">Nothing awaiting approval.</div>}
      </>
    );
  }

  if (view === 'schedule') {
    const approved = drafts.filter((x) => x.stage === 'Approved');
    const scheduled = drafts.filter((x) => x.stage === 'Scheduled');
    return (
      <>
        <p className="lead">Schedule approved pieces, then publish when the date arrives.</p>
        <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--k-tertiary)', marginBottom: 14 }}>Approved, ready to schedule</h2>
        {approved.length ? approved.map((x) => (
          <div className="item" key={x.id}>
            <h3>{x.title}</h3><div className="from mono">{x.id} . {x.author}</div>
            <div className="actions">
              <input type="date" style={{ maxWidth: 200 }} value={dates[x.id] || ''} onChange={(e) => setDates((m) => ({ ...m, [x.id]: e.target.value }))} />
              <button className="btn solid" onClick={() => schedule(x.id)}>Schedule</button>
            </div>
          </div>
        )) : <div className="empty">Nothing approved and waiting.</div>}
        <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--k-tertiary)', margin: '28px 0 14px' }}>Scheduled</h2>
        {scheduled.length ? (
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th scope="col">Draft</th><th scope="col">Title</th><th scope="col">Publish date</th><th scope="col">Action</th></tr></thead>
            <tbody>{scheduled.map((x) => <tr key={x.id}><td className="mono">{x.id}</td><td>{x.title}</td><td className="mono">{x.pubDate}</td><td><button className="btn solid" onClick={() => publish(x.id)}>Publish now</button></td></tr>)}</tbody>
          </table></div>
        ) : <div className="empty">Nothing scheduled.</div>}
      </>
    );
  }

  if (view === 'published') {
    return (
      <>
        <p className="lead">Live editorial. Written like a laboratory, read like a library.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Draft</th><th scope="col">Title</th><th scope="col">Author</th><th scope="col">Published</th></tr></thead>
          <tbody>{drafts.filter((x) => x.stage === 'Published').map((x) => <tr key={x.id}><td className="mono">{x.id}</td><td>{x.title}</td><td className="mono">{x.author}</td><td className="mono">{x.pubDate}</td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  // drafts (default)
  const sel = selDraft ? drafts.find((x) => x.id === selDraft) || null : null;
  return (
    <>
      <p className="lead">Every draft and where it sits in the chain. The scan state decides whether a draft can clear.</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th scope="col">Draft</th><th scope="col">Title</th><th scope="col">Author</th><th scope="col">Scan</th><th scope="col">Stage</th></tr></thead>
        <tbody>{drafts.map((x) => (
          <tr key={x.id} className={`clickable${selDraft === x.id ? ' sel' : ''}`} onClick={() => setSelDraft(selDraft === x.id ? null : x.id)}>
            <td className="mono">{x.id}</td><td>{x.title}</td><td className="mono">{x.author}</td><td>{scanChip(x.scan)}</td><td>{stageChip(x.stage)}</td>
          </tr>
        ))}</tbody>
      </table></div>
      {sel ? <DraftDetail x={sel} /> : null}
    </>
  );
}

function DraftDetail({ x }: { x: Draft }) {
  return (
    <div className="detailpanel">
      <h3>{x.id}</h3>
      <div className="keyfield"><span className="kf-k">Title</span><span className="kf-v">{x.title}</span></div>
      <div className="keyfield"><span className="kf-k">Author</span><span className="kf-v">{x.author}</span></div>
      <div className="keyfield"><span className="kf-k">Scan</span><span className="kf-v">{scanChip(x.scan)}</span></div>
      <div className="keyfield"><span className="kf-k">Publish date</span><span className="kf-v">{x.pubDate}</span></div>
      {x.flag ? <div className="privacy" style={{ marginTop: 14, borderLeftColor: 'var(--k-fail)' }}>{x.flag}</div> : null}
      {x.blocker ? <div className="body" style={{ marginTop: 12, color: 'var(--k-tertiary)', fontSize: 13 }}>{x.blocker}</div> : null}
      <ChainStepper stage={x.stage} />
    </div>
  );
}
