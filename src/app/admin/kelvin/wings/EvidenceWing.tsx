'use client';

import { useCallback, useEffect, useState } from 'react';
import { publicUrl, type Batch, type Coa, type EvidenceData } from './evidence';
import type { KEvent } from '../store';

// The Evidence wing, backed by Supabase. Data comes from /api/admin/kelvin/evidence;
// publish, unpublish, adjudicate, and match persist through the gated mutate route,
// where the publish gate (COA state Passed) is enforced. Actions refetch and emit
// events into the Command feed.

type Props = { view: string; addEvent: (e: Omit<KEvent, 'id'>) => void; flash: (m: string) => void; now: () => string };

function coaChip(state: string) {
  if (state === 'Passed') return <span className="chip pass"><span className="sq pass" />Passed</span>;
  if (state === 'Failed') return <span className="chip fail"><span className="sq fail" />Failed</span>;
  return <span className="chip attention"><span className="sq attention" />{state}</span>;
}
function pubChip(p: string) {
  if (p === 'Published') return <span className="chip pass"><span className="sq pass" />Published</span>;
  if (p === 'Archived') return <span className="chip">Archived</span>;
  return <span className="chip" style={{ color: 'var(--k-tertiary)' }}>Unpublished</span>;
}

export default function EvidenceWing({ view, addEvent, flash, now }: Props) {
  const [data, setData] = useState<EvidenceData | null>(null);
  const [selBatch, setSelBatch] = useState<string | null>(null);
  const [selCoa, setSelCoa] = useState<string | null>(null);
  const [matchSel, setMatchSel] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try { const r = await fetch('/api/admin/kelvin/evidence'); if (r.ok) setData(await r.json()); } catch { /* keep */ }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function mutate(payload: Record<string, unknown>): Promise<{ ok: boolean; reason?: string; state?: string }> {
    try {
      const r = await fetch('/api/admin/kelvin/evidence/mutate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      return await r.json().catch(() => ({ ok: false, reason: 'That did not resolve.' }));
    } catch { return { ok: false, reason: 'That did not resolve.' }; }
  }

  async function publish(id: string) {
    const res = await mutate({ op: 'publish', id });
    if (res.ok) {
      addEvent({ agent: 'SENTINEL', time: now(), type: 'GATE', summary: `Published COA for ${id}`, sub: `Batch cleared the publish gate. Live on the public transparency page at ${publicUrl(id)}.` });
      setSelBatch(id); await load(); flash(`Published ${id} to transparency.`);
    } else { flash(res.reason || 'Blocked.'); }
  }
  async function unpublish(id: string) {
    await mutate({ op: 'unpublish', id });
    addEvent({ agent: 'SENTINEL', time: now(), type: 'DECISION', summary: `Unpublished ${id}`, sub: 'Batch removed from the public transparency page by owner.' });
    await load(); flash(`Unpublished ${id}.`);
  }
  async function adjudicate(id: string) {
    const res = await mutate({ op: 'adjudicate', id });
    if (res.ok) {
      addEvent({ agent: 'CODEX', time: now(), type: 'KNOWLEDGE', summary: `Adjudicated ${id}: ${res.state}`, sub: `Certificate resolved from its panels. The publish gate reads this state.` });
      await load(); flash(`${id} adjudicated: ${res.state}.`);
    } else { flash(res.reason || 'Blocked.'); }
  }
  async function match(id: string) {
    const batchId = matchSel[id];
    if (!batchId) { flash('No open batch to match.'); return; }
    const res = await mutate({ op: 'match', id, batchId });
    if (res.ok) {
      addEvent({ agent: 'CODEX', time: now(), type: 'KNOWLEDGE', summary: `Matched ${id} to ${batchId}`, sub: 'Certificate matched to a batch and ingested. Ready to adjudicate.' });
      await load(); flash(`Matched ${id} to ${batchId}.`);
    } else { flash(res.reason || 'Blocked.'); }
  }

  if (!data) return <div className="empty">Loading Evidence data.</div>;

  const publishedCount = data.batches.filter((x) => x.publish === 'Published').length;
  const passedUnpublished = data.batches.filter((x) => x.coa === 'Passed' && x.publish === 'Unpublished').length;

  if (view === 'batches') {
    const rows = data.batches.filter((x) => x.publish !== 'Archived');
    const sel = selBatch ? data.batches.find((b) => b.id === selBatch) || null : null;
    return (
      <>
        <p className="lead">The batch registry. Every batch carries a COA state and a publish state. Nothing reaches the public transparency page until its COA is ingested and Passed.</p>
        <div className="kpis">
          <div className="kpi"><div className="k">Batches</div><div className="v">{String(rows.length).padStart(2, '0')}</div><div className="m">active registry</div></div>
          <div className="kpi"><div className="k">Published</div><div className="v">{String(publishedCount).padStart(2, '0')}</div><div className="m">live on transparency</div></div>
          <div className="kpi"><div className="k">Ready to publish</div><div className="v">{String(passedUnpublished).padStart(2, '0')}</div><div className="m">Passed and unpublished</div></div>
          <div className="kpi"><div className="k">Awaiting COA</div><div className="v">{String(rows.filter((x) => x.coa === 'Awaiting' || x.coa === 'Ingested').length).padStart(2, '0')}</div><div className="m">intake in flight</div></div>
        </div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Batch</th><th scope="col">Item</th><th scope="col">Package</th><th scope="col">COA</th><th scope="col">Publish</th><th scope="col">Laboratory</th></tr></thead>
          <tbody>
            {rows.map((bt) => (
              <tr key={bt.id} className={`clickable${selBatch === bt.id ? ' sel' : ''}`} onClick={() => setSelBatch(selBatch === bt.id ? null : bt.id)}>
                <td className="mono">{bt.id}</td><td>{bt.item}</td><td className="mono">{bt.tag.slice(-6)}</td><td>{coaChip(bt.coa)}</td><td>{pubChip(bt.publish)}</td><td>{bt.lab}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        {sel ? <BatchDetail bt={sel} publish={publish} unpublish={unpublish} flash={flash} /> : null}
      </>
    );
  }

  if (view === 'coa-intake') {
    const sel = selCoa ? data.coas.find((c) => c.id === selCoa) || null : null;
    const openBatches = data.batches.filter((x) => x.coa === 'Awaiting');
    return (
      <>
        <p className="lead">Certificates of analysis arrive from the laboratories. Match an unmatched certificate to a batch, then adjudicate it. Adjudication sets the batch COA state, which the publish gate reads.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Certificate</th><th scope="col">Laboratory</th><th scope="col">Batch</th><th scope="col">State</th><th scope="col">Action</th></tr></thead>
          <tbody>
            {data.coas.map((coa) => (
              <tr key={coa.id} className={`clickable${selCoa === coa.id ? ' sel' : ''}`} onClick={(e) => { if ((e.target as HTMLElement).tagName === 'SELECT' || (e.target as HTMLElement).tagName === 'OPTION') return; setSelCoa(selCoa === coa.id ? null : coa.id); }}>
                <td className="mono">{coa.id}</td><td>{coa.lab}</td><td className="mono">{coa.batch}</td><td>{coaChip(coa.state)}</td>
                <td>
                  {coa.state === 'Received' ? (
                    <span>
                      <select value={matchSel[coa.id] || ''} onChange={(e) => setMatchSel((m) => ({ ...m, [coa.id]: e.target.value }))} style={{ width: 'auto', display: 'inline-block', padding: '6px 10px', fontFamily: 'var(--k-font-mono)', fontSize: 12 }}>
                        <option value="">Select batch</option>
                        {openBatches.map((bt) => <option key={bt.id} value={bt.id}>{bt.id} . {bt.item}</option>)}
                      </select>
                      <button className="btn" onClick={() => match(coa.id)} style={{ marginLeft: 8 }}>Match</button>
                    </span>
                  ) : coa.state === 'Ingested' ? (
                    <button className="btn solid" onClick={() => adjudicate(coa.id)}>Adjudicate</button>
                  ) : (
                    <span style={{ color: 'var(--k-tertiary)', fontSize: 12 }}>Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
        {sel ? <CoaDetail coa={sel} /> : null}
      </>
    );
  }

  if (view === 'publishing') {
    const rows = data.batches.filter((x) => x.publish !== 'Archived');
    return (
      <>
        <p className="lead">Publishing pushes a batch COA to the public transparency page, where a visitor enters a batch number and reads the full profile. The gate refuses anything not Passed.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Batch</th><th scope="col">Item</th><th scope="col">COA</th><th scope="col">Publish</th><th scope="col">Public link</th><th scope="col">Action</th></tr></thead>
          <tbody>
            {rows.map((bt) => {
              const canPublish = bt.coa === 'Passed' && bt.publish !== 'Published';
              return (
                <tr key={bt.id}>
                  <td className="mono">{bt.id}</td><td>{bt.item}</td><td>{coaChip(bt.coa)}</td><td>{pubChip(bt.publish)}</td>
                  <td>{bt.publish === 'Published' ? <span className="reflink">{publicUrl(bt.id)}</span> : <span style={{ color: 'var(--k-tertiary)' }}>UNKNOWN</span>}</td>
                  <td>
                    {bt.publish === 'Published'
                      ? <button className="btn" onClick={() => unpublish(bt.id)}>Unpublish</button>
                      : canPublish
                        ? <button className="btn solid" onClick={() => publish(bt.id)}>Publish</button>
                        : <button className="btn disabled" onClick={() => flash(`Batch ${bt.id} is ${bt.coa}. Only a Passed COA can publish.`)}>Publish</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table></div>
      </>
    );
  }

  if (view === 'terpenes') {
    const rows = data.batches.filter((x) => x.terps.length);
    return (
      <>
        <p className="lead">Terpene profiles per batch. Concentrations render UNKNOWN until a COA supplies them. The terpene names reconcile against the terpene index in Command Knowledge.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Batch</th><th scope="col">Item</th><th scope="col">Dominant terpenes</th><th scope="col">Concentrations</th><th scope="col">COA</th></tr></thead>
          <tbody>{rows.map((bt) => <tr key={bt.id}><td className="mono">{bt.id}</td><td>{bt.item}</td><td>{bt.terps.join(', ')}</td><td className="mono" style={{ color: 'var(--k-tertiary)' }}>UNKNOWN</td><td>{coaChip(bt.coa)}</td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  if (view === 'laboratories') {
    return (
      <>
        <p className="lead">The laboratories that test CedarGrowth batches. Every batch we release is tested by a third party accredited laboratory.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Laboratory</th><th scope="col">Accreditation</th><th scope="col">License</th><th scope="col">Turnaround</th><th scope="col">Status</th></tr></thead>
          <tbody>{data.labs.map((l) => <tr key={l.name}><td>{l.name}</td><td className="mono">{l.accreditation}</td><td className="mono">{l.license}</td><td>{l.turnaround}</td><td><span className="chip pass"><span className="sq pass" />{l.status}</span></td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  // archive
  const rows = data.batches.filter((x) => x.publish === 'Archived');
  return (
    <>
      <p className="lead">Superseded and retired batches. The record is kept for traceability. It is not served on the public page.</p>
      {rows.length ? (
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Batch</th><th scope="col">Item</th><th scope="col">COA</th><th scope="col">Archived</th><th scope="col">Laboratory</th></tr></thead>
          <tbody>{rows.map((bt) => <tr key={bt.id}><td className="mono">{bt.id}</td><td>{bt.item}</td><td>{coaChip(bt.coa)}</td><td className="mono">{bt.pubDate}</td><td>{bt.lab}</td></tr>)}</tbody>
        </table></div>
      ) : <div className="empty">No archived batches.</div>}
    </>
  );
}

function BatchDetail({ bt, publish, unpublish, flash }: { bt: Batch; publish: (id: string) => void; unpublish: (id: string) => void; flash: (m: string) => void }) {
  const canPublish = bt.coa === 'Passed' && bt.publish !== 'Published';
  return (
    <div className="detailpanel">
      <h3>{bt.id}</h3>
      <div className="keyfield"><span className="kf-k">Item</span><span className="kf-v">{bt.item}</span></div>
      <div className="keyfield"><span className="kf-k">Package tag</span><span className="kf-v">{bt.tag}</span></div>
      <div className="keyfield"><span className="kf-k">COA</span><span className="kf-v">{bt.coaId} {coaChip(bt.coa)}</span></div>
      <div className="keyfield"><span className="kf-k">Publish</span><span className="kf-v">{pubChip(bt.publish)} {bt.publish === 'Published' ? `since ${bt.pubDate}` : ''}</span></div>
      <div className="keyfield"><span className="kf-k">Dominant terpenes</span><span className="kf-v">{bt.terps.length ? bt.terps.join(', ') : 'UNKNOWN'}</span></div>
      <div className="actions" style={{ marginTop: 16 }}>
        {canPublish
          ? <button className="btn solid" onClick={() => publish(bt.id)}>Publish to transparency</button>
          : bt.publish === 'Published'
            ? <button className="btn" onClick={() => unpublish(bt.id)}>Unpublish</button>
            : <button className="btn disabled" onClick={() => flash(`Batch ${bt.id} is ${bt.coa}. A COA must be ingested and Passed before it can publish.`)}>Publish to transparency</button>}
      </div>
    </div>
  );
}

function CoaDetail({ coa }: { coa: Coa }) {
  return (
    <div className="detailpanel">
      <h3>{coa.id}</h3>
      <div className="keyfield"><span className="kf-k">Laboratory</span><span className="kf-v">{coa.lab}</span></div>
      <div className="keyfield"><span className="kf-k">Batch</span><span className="kf-v">{coa.batch}</span></div>
      <div className="keyfield"><span className="kf-k">Potency</span><span className="kf-v">{coa.potency}</span></div>
      <div className="keyfield"><span className="kf-k">State</span><span className="kf-v">{coaChip(coa.state)}</span></div>
      <div className="label" style={{ marginTop: 16, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--k-tertiary)' }}>Panels</div>
      {coa.panels
        ? Object.keys(coa.panels).map((k) => (
            <div className="keyfield" key={k}><span className="kf-k">{k}</span><span className="kf-v" style={{ color: coa.panels![k] === 'Fail' ? 'var(--k-fail)' : coa.panels![k] === 'Pass' ? 'var(--k-pass)' : 'var(--k-secondary)' }}>{coa.panels![k]}</span></div>
          ))
        : <div className="keyfield"><span className="kf-k">Panels</span><span className="kf-v">UNKNOWN, not yet ingested</span></div>}
    </div>
  );
}
