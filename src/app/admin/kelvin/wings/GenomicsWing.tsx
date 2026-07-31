'use client';

import { useReducer, useState } from 'react';
import { Genomics, type Kit } from './genomics';
import type { KEvent } from '../store';

// The Genomics wing. Counts and status only. The verbatim privacy statement
// renders on every route, results always read Sealed, and an attempt to read a
// result returns the structural refusal. There is no owner override.

type Props = { view: string; addEvent: (e: Omit<KEvent, 'id'>) => void; flash: (m: string) => void; now: () => string };

const PRIVACY = 'Genomics displays counts and status only. Individual genetic results are unreadable from any administrative context, including this one, and there is no owner override. This is a property of how the wing is built, not a permission that can be granted.';

function statusChip(s: string) {
  if (s === 'Delivered') return <span className="chip pass"><span className="sq pass" />{s}</span>;
  if (s === 'At lab' || s === 'Resulted') return <span className="chip attention"><span className="sq attention" />{s}</span>;
  return <span className="chip" style={{ color: 'var(--k-secondary)' }}>{s}</span>;
}
function consentChip(c: string) {
  if (c === 'Granted') return <span className="chip pass"><span className="sq pass" />Granted</span>;
  if (c === 'Withdrawn') return <span className="chip fail"><span className="sq fail" />Withdrawn</span>;
  return <span className="chip attention"><span className="sq attention" />Pending</span>;
}
function sealedChip(result: string) {
  if (result === 'Sealed') return <span className="chip" style={{ color: 'var(--k-genomics)', borderColor: 'rgba(116,129,160,0.5)' }}><span className="sq" style={{ background: 'var(--k-genomics)' }} />Sealed</span>;
  return <span className="chip" style={{ color: 'var(--k-tertiary)' }}>Pending</span>;
}

export default function GenomicsWing({ view, addEvent, flash, now }: Props) {
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [selKit, setSelKit] = useState<string | null>(null);

  function ship(id: string) {
    const x = Genomics.markShipped(id);
    if (x) {
      addEvent({ agent: 'MERIDIAN', time: now(), type: 'DECISION', summary: `Kit ${id} marked shipped`, sub: 'Fulfillment advanced. No genetic data is touched by this action.' });
      force();
      flash(`Kit ${id} marked shipped.`);
    }
  }

  const banner = <div className="privacy" style={{ marginTop: 0, marginBottom: 24 }}>{PRIVACY}</div>;

  if (view === 'fulfillment') {
    const rows = Genomics.listKits().filter((x) => x.status === 'Ordered' || x.status === 'Shipped');
    return (
      <>
        {banner}
        <p className="lead">Kit fulfillment. Kits waiting to ship and kits in transit. This is logistics, not results.</p>
        <div className="kpis">
          <div className="kpi"><div className="k">To ship</div><div className="v">{String(rows.filter((x) => x.status === 'Ordered').length).padStart(2, '0')}</div><div className="m">status Ordered</div></div>
          <div className="kpi"><div className="k">In transit</div><div className="v">{String(rows.filter((x) => x.status === 'Shipped').length).padStart(2, '0')}</div><div className="m">status Shipped</div></div>
          <div className="kpi"><div className="k">At lab</div><div className="v">{String(Genomics.listKits().filter((x) => x.status === 'At lab').length).padStart(2, '0')}</div><div className="m">returned and received</div></div>
          <div className="kpi"><div className="k">Kits total</div><div className="v">{String(Genomics.listKits().length).padStart(2, '0')}</div><div className="m">all lifecycle states</div></div>
        </div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Kit</th><th scope="col">Subject</th><th scope="col">Status</th><th scope="col">Consent</th><th scope="col">Action</th></tr></thead>
          <tbody>{rows.map((x) => <tr key={x.id}><td className="mono">{x.id}</td><td className="mono">{x.subject}</td><td>{statusChip(x.status)}</td><td>{consentChip(x.consent)}</td><td>{x.status === 'Ordered' ? <button className="btn" onClick={() => ship(x.id)}>Mark shipped</button> : <span style={{ color: 'var(--k-tertiary)', fontSize: 12 }}>In transit</span>}</td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  if (view === 'lab-status') {
    const rows = Genomics.listKits().filter((x) => x.status === 'At lab' || x.status === 'Resulted' || x.status === 'Delivered');
    return (
      <>
        {banner}
        <p className="lead">Laboratory status. Where each kit sits in sequencing and analysis. The status advances. The data never surfaces here.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Kit</th><th scope="col">Laboratory</th><th scope="col">Status</th><th scope="col">Turnaround</th><th scope="col">Result</th></tr></thead>
          <tbody>{rows.map((x) => <tr key={x.id}><td className="mono">{x.id}</td><td>{x.lab}</td><td>{statusChip(x.status)}</td><td className="mono" style={{ color: 'var(--k-tertiary)' }}>UNKNOWN</td><td>{sealedChip(x.result)}</td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  if (view === 'consent') {
    const rows = Genomics.listKits();
    const cc = Genomics.consentCounts();
    return (
      <>
        {banner}
        <p className="lead">Consent records. A withdrawal holds delivery and triggers data handling under the consent scope. Consent state is a member decision, shown here as status.</p>
        <div className="kpis">
          <div className="kpi"><div className="k">Granted</div><div className="v">{String(cc.Granted).padStart(2, '0')}</div><div className="m">active consent</div></div>
          <div className="kpi"><div className="k">Pending</div><div className="v">{String(cc.Pending).padStart(2, '0')}</div><div className="m">awaiting consent</div></div>
          <div className="kpi"><div className="k">Withdrawn</div><div className="v">{String(cc.Withdrawn).padStart(2, '0')}</div><div className="m">delivery held</div></div>
          <div className="kpi"><div className="k">Kits total</div><div className="v">{String(rows.length).padStart(2, '0')}</div><div className="m">consent tracked</div></div>
        </div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Kit</th><th scope="col">Subject</th><th scope="col">Consent</th><th scope="col">Delivery</th></tr></thead>
          <tbody>{rows.map((x) => <tr key={x.id}><td className="mono">{x.id}</td><td className="mono">{x.subject}</td><td>{consentChip(x.consent)}</td><td className="mono">{x.consent === 'Withdrawn' ? 'Held' : x.delivery}</td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  if (view === 'delivery') {
    const rows = Genomics.listKits().filter((x) => x.result === 'Sealed');
    return (
      <>
        {banner}
        <p className="lead">Result delivery. Delivery is to the member directly. This wing shows whether a result was delivered, never what it contains.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Kit</th><th scope="col">Subject</th><th scope="col">Result</th><th scope="col">Delivery</th><th scope="col">Consent</th></tr></thead>
          <tbody>{rows.map((x) => <tr key={x.id}><td className="mono">{x.id}</td><td className="mono">{x.subject}</td><td>{sealedChip(x.result)}</td><td className="mono">{x.delivery}</td><td>{consentChip(x.consent)}</td></tr>)}</tbody>
        </table></div>
        <div className="privacy" style={{ marginTop: 24 }}>Delivery status is all that is visible here. The result itself is sent to the member and is unreadable from any administrative context, including this one. There is no owner override.</div>
      </>
    );
  }

  if (view === 'metrics') {
    const cs = Genomics.countsByStatus();
    const cc = Genomics.consentCounts();
    const total = Genomics.listKits().length;
    const order = ['Ordered', 'Shipped', 'At lab', 'Resulted', 'Delivered'];
    return (
      <>
        {banner}
        <p className="lead">Aggregate metrics. Counts and rates only. Nothing on this page can be traced to an individual result.</p>
        <div className="kpis">
          <div className="kpi"><div className="k">Kits total</div><div className="v">{String(total).padStart(2, '0')}</div><div className="m">all states</div></div>
          <div className="kpi"><div className="k">Resulted</div><div className="v">{String(Genomics.resultedCount()).padStart(2, '0')}</div><div className="m">sealed and sent</div></div>
          <div className="kpi"><div className="k">Delivered</div><div className="v">{String(Genomics.deliveredCount()).padStart(2, '0')}</div><div className="m">to the member</div></div>
          <div className="kpi"><div className="k">Consent granted</div><div className="v">{String(cc.Granted).padStart(2, '0')}<span style={{ color: 'var(--k-tertiary)', fontSize: 16 }}> / {total}</span></div><div className="m">active consent</div></div>
        </div>
        <div className="two-col">
          <div className="col"><h2>By status</h2>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th scope="col">Status</th><th scope="col">Count</th></tr></thead>
              <tbody>{order.map((s) => <tr key={s}><td>{s}</td><td className="mono">{String(cs[s] || 0).padStart(2, '0')}</td></tr>)}</tbody></table></div>
          </div>
          <div className="col"><h2>By consent</h2>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th scope="col">Consent</th><th scope="col">Count</th></tr></thead>
              <tbody>{['Granted', 'Pending', 'Withdrawn'].map((cKey) => <tr key={cKey}><td>{cKey}</td><td className="mono">{String(cc[cKey] || 0).padStart(2, '0')}</td></tr>)}</tbody></table></div>
          </div>
        </div>
      </>
    );
  }

  // kits (default)
  const sel = selKit ? Genomics.getKit(selKit) : null;
  return (
    <>
      {banner}
      <p className="lead">DNA test kits by lifecycle status. Subjects are referenced by an anonymized token. No genotype or trait value is stored or shown here.</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th scope="col">Kit</th><th scope="col">Subject</th><th scope="col">Status</th><th scope="col">Consent</th><th scope="col">Result</th></tr></thead>
        <tbody>{Genomics.listKits().map((x) => (
          <tr key={x.id} className={`clickable${selKit === x.id ? ' sel' : ''}`} onClick={() => setSelKit(selKit === x.id ? null : x.id)}>
            <td className="mono">{x.id}</td><td className="mono">{x.subject}</td><td>{statusChip(x.status)}</td><td>{consentChip(x.consent)}</td><td>{sealedChip(x.result)}</td>
          </tr>
        ))}</tbody>
      </table></div>
      {sel ? <KitDetail x={sel} ship={ship} flash={flash} /> : null}
    </>
  );
}

function KitDetail({ x, ship, flash }: { x: Kit; ship: (id: string) => void; flash: (m: string) => void }) {
  return (
    <div className="detailpanel">
      <h3>{x.id}</h3>
      <div className="keyfield"><span className="kf-k">Subject</span><span className="kf-v">{x.subject}</span></div>
      <div className="keyfield"><span className="kf-k">Status</span><span className="kf-v">{statusChip(x.status)}</span></div>
      <div className="keyfield"><span className="kf-k">Consent</span><span className="kf-v">{consentChip(x.consent)}</span></div>
      <div className="keyfield"><span className="kf-k">Laboratory</span><span className="kf-v">{x.lab}</span></div>
      <div className="keyfield"><span className="kf-k">Ordered</span><span className="kf-v">{x.ordered}</span></div>
      <div className="keyfield"><span className="kf-k">Delivery</span><span className="kf-v">{x.delivery}</span></div>
      <div className="keyfield"><span className="kf-k">Result</span><span className="kf-v">{sealedChip(x.result)}</span></div>
      <div className="privacy" style={{ marginTop: 16 }}>This result is delivered directly to the member. It is unreadable from any administrative context, including this one. There is no owner override.</div>
      <div className="actions" style={{ marginTop: 16 }}>
        <button className="btn disabled" onClick={() => flash(Genomics.readResult())}>Attempt to read result</button>
        {x.status === 'Ordered' ? <button className="btn solid" onClick={() => ship(x.id)}>Mark shipped</button> : null}
      </div>
    </div>
  );
}
