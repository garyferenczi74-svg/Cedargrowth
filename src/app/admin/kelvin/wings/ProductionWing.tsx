'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  THRESHOLD_PCT,
  overThreshold,
  releasable,
  traceFor,
  variance,
  type Connection,
  type Pkg,
  type ProdData,
  type Transfer,
} from './production';
import type { KEvent } from '../store';

// The Production wing, Metrc first, now backed by Supabase. Data is fetched from
// /api/admin/kelvin/production; the test gate and manifest requirement are
// enforced server side when a transfer is created. Actions refetch and emit
// events into the Command feed.

type Props = {
  view: string;
  addEvent: (e: Omit<KEvent, 'id'>) => void;
  flash: (msg: string) => void;
  now: () => string;
};

function gateChip(test: string) {
  if (releasable(test)) return <span className="gate ok"><span className="sq pass" />Releasable</span>;
  if (test === 'TestFailed') return <span className="gate no"><span className="sq fail" />Blocked</span>;
  return <span className="gate wait"><span className="sq attention" />Held</span>;
}

function ConnBanner({ c }: { c: Connection }) {
  return (
    <div className="conn warn" style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--k-hairline)', background: 'var(--k-parchment)', padding: '12px 16px', marginBottom: 24, fontFamily: 'var(--k-font-mono)', fontSize: 12, color: 'var(--k-secondary)', flexWrap: 'wrap' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--k-attention)', flexShrink: 0 }} />
      {`Metrc . ${c.facility} . ${c.state} . last sync ${c.lastSync}`}
    </div>
  );
}

export default function ProductionWing({ view, addEvent, flash, now }: Props) {
  const [data, setData] = useState<ProdData | null>(null);
  const [selPkg, setSelPkg] = useState<string | null>(null);
  const [selTx, setSelTx] = useState<string | null>(null);
  const [traceTag, setTraceTag] = useState('');
  const [txManifest, setTxManifest] = useState('');
  const [txParty, setTxParty] = useState('');
  const [txPkg, setTxPkg] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/kelvin/production');
      if (r.ok) setData(await r.json());
    } catch {
      // leave data as is; the empty state shows
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createTransfer() {
    if (!data) return;
    const pkgId = txPkg || data.packages[0]?.id || '';
    try {
      const r = await fetch('/api/admin/kelvin/production/transfer', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ manifest: txManifest, party: txParty, pkgId }),
      });
      const res = await r.json().catch(() => ({ ok: false, reason: 'That did not resolve.' }));
      if (res.ok && res.transfer) {
        addEvent({ agent: 'MERIDIAN', time: now(), type: 'DECISION', summary: `Transfer created on manifest ${res.transfer.manifest}`, sub: `Outbound to ${res.transfer.party}. Package cleared the test gate before departure.` });
        setTxManifest(''); setTxParty('');
        await load();
        setSelTx(res.transfer.id);
        flash(`Transfer created on manifest ${res.transfer.manifest}.`);
      } else {
        flash(res.reason || 'Blocked.');
      }
    } catch {
      flash('That did not resolve.');
    }
  }

  async function ack(id: string) {
    if (!data) return;
    const a = data.alerts.find((x) => x.id === id);
    try {
      const r = await fetch('/api/admin/kelvin/production/acknowledge', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }),
      });
      if (r.ok && a) {
        addEvent({ agent: 'SENTINEL', time: now(), type: 'AUDIT', summary: `Acknowledged: ${a.kind} on ${a.subject}`, sub: `Production alert ${id} acknowledged by owner. Recorded to the audit chain.` });
        await load();
        flash('Acknowledged. Recorded to the Command feed.');
      }
    } catch {
      flash('That did not resolve.');
    }
  }

  if (!data) return <div className="empty">Loading Production data.</div>;

  if (view === 'dashboard') {
    const pk = data.packages;
    const rel = pk.filter((p) => releasable(p)).length;
    const inTransit = data.transfers.filter((t) => t.status === 'In transit').length;
    const openA = data.alerts.filter((a) => a.status === 'open');
    const tx = data.transfers.slice(0, 4);
    return (
      <>
        <ConnBanner c={data.connection} />
        <div className="kpis">
          <div className="kpi"><div className="k">Active packages</div><div className="v">{String(pk.filter((p) => p.status === 'Active').length).padStart(2, '0')}</div><div className="m">{rel} releasable</div></div>
          <div className="kpi"><div className="k">Transfers in transit</div><div className="v">{String(inTransit).padStart(2, '0')}</div><div className="m">manifest gated</div></div>
          <div className="kpi"><div className="k">Open alerts</div><div className="v">{String(openA.length).padStart(2, '0')}</div><div className="m">discrepancy and gate</div></div>
          <div className="kpi"><div className="k">Test gate</div><div className="v">{rel}<span style={{ color: 'var(--k-tertiary)', fontSize: 16 }}> / {pk.length}</span></div><div className="m">TestPassed or RetestPassed</div></div>
        </div>
        <div className="two-col">
          <div className="col"><h2>Recent transfers</h2>
            {tx.map((t) => (
              <div className="alert-row" key={t.id}><span className="stripe" style={{ background: t.status === 'Draft' ? 'var(--k-attention)' : 'var(--k-hairline)' }} /><div className="body"><div className="a-sub">{t.manifest} . {t.dir} . {t.status}</div><div className="a-det">{t.party}</div></div></div>
            ))}
          </div>
          <div className="col"><h2>Open alerts</h2>
            {openA.slice(0, 4).map((a) => (
              <div className="alert-row" key={a.id}><span className={`stripe ${a.sev}`} /><div className="body"><div className="a-sub">{a.kind} . {a.subject}</div><div className="a-det">{a.detail}</div></div></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (view === 'stock') {
    const sel = selPkg ? data.packages.find((p) => p.id === selPkg) || null : null;
    return (
      <>
        <p className="lead">Metrc packages. The test gate decides what can move. A package is releasable only at TestPassed or RetestPassed.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Tag</th><th scope="col">Item</th><th scope="col">Category</th><th scope="col">Quantity</th><th scope="col">Test state</th><th scope="col">Gate</th><th scope="col">Location</th></tr></thead>
          <tbody>
            {data.packages.map((p) => (
              <tr key={p.id} className={`clickable${selPkg === p.id ? ' sel' : ''}`} onClick={() => setSelPkg(selPkg === p.id ? null : p.id)}>
                <td className="mono">{p.tag}</td><td>{p.item}</td><td>{p.cat}</td><td className="mono">{p.qty} {p.uom}</td><td className="mono">{p.test}</td><td>{gateChip(p.test)}</td><td>{p.loc}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        {sel ? <PackageDetail p={sel} flash={flash} /> : null}
      </>
    );
  }

  if (view === 'orders') {
    const sel = selTx ? data.transfers.find((t) => t.id === selTx) || null : null;
    return (
      <>
        <p className="lead">Metrc transfers. A transfer cannot depart without a manifest, and every package on it must clear the test gate.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Manifest</th><th scope="col">Direction</th><th scope="col">Counterparty</th><th scope="col">Packages</th><th scope="col">Status</th><th scope="col">Variance</th></tr></thead>
          <tbody>
            {data.transfers.map((t) => {
              const v = variance(t);
              const over = overThreshold(t);
              return (
                <tr key={t.id} className={`clickable${selTx === t.id ? ' sel' : ''}`} onClick={() => setSelTx(selTx === t.id ? null : t.id)}>
                  <td className="mono">{t.manifest}</td><td>{t.dir}</td><td>{t.party}</td><td className="mono">{String(t.pkgs.length).padStart(2, '0')}</td><td className="mono">{t.status}</td>
                  <td className="mono" style={{ color: over ? 'var(--k-fail)' : 'var(--k-secondary)' }}>{v == null ? 'UNKNOWN' : `${v} pct${over ? ' over' : ''}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table></div>
        {sel ? <TransferDetail t={sel} data={data} ack={ack} /> : null}
        <div className="detailpanel">
          <h3>Create outbound transfer</h3>
          <div className="form-grid">
            <div className="row2">
              <div className="field"><label>Manifest number</label><input className="mono" value={txManifest} onChange={(e) => setTxManifest(e.target.value)} placeholder="Required before departure" /></div>
              <div className="field"><label>Counterparty</label><input value={txParty} onChange={(e) => setTxParty(e.target.value)} placeholder="Receiving dispensary" /></div>
            </div>
            <div className="field"><label>Package</label>
              <select value={txPkg || data.packages[0]?.id || ''} onChange={(e) => setTxPkg(e.target.value)}>
                {data.packages.map((p) => <option key={p.id} value={p.id}>{p.tag} . {p.item} . {p.test}</option>)}
              </select>
            </div>
            <div className="actions"><button className="btn solid" onClick={createTransfer}>Create transfer</button><span style={{ color: 'var(--k-tertiary)', fontSize: 12 }}>The gate and manifest checks run on create.</span></div>
          </div>
        </div>
      </>
    );
  }

  if (view === 'runs') {
    return (
      <>
        <p className="lead">Production runs and harvests. Each run carries source material, weights, stage, and the packages it minted.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Run</th><th scope="col">Name</th><th scope="col">Source material</th><th scope="col">Wet</th><th scope="col">Dry</th><th scope="col">Stage</th><th scope="col">Packages</th></tr></thead>
          <tbody>
            {data.harvests.map((h) => (
              <tr key={h.id}><td className="mono">{h.id}</td><td>{h.name}</td><td>{h.source}</td><td className="mono">{h.wet}</td><td className="mono">{h.dry}</td><td className="mono">{h.stage}</td><td className="mono">{String(h.packages.length).padStart(2, '0')}</td></tr>
            ))}
          </tbody>
        </table></div>
      </>
    );
  }

  if (view === 'accounts') {
    const c = data.connection;
    return (
      <>
        <p className="lead">Metrc uses two key authentication. A vendor or software key and a per user key are both required before any package, transfer, or sale transmits.</p>
        <ConnBanner c={c} />
        <div className="detailpanel"><h3>Facility</h3>
          <div className="keyfield"><span className="kf-k">Facility</span><span className="kf-v">{c.facility}</span></div>
          <div className="keyfield"><span className="kf-k">License type</span><span className="kf-v">{c.licenseType}</span></div>
          <div className="keyfield"><span className="kf-k">License number</span><span className="kf-v">{c.license}</span></div>
        </div>
        <div className="detailpanel"><h3>Authentication</h3>
          <div className="keyfield"><span className="kf-k">Vendor or software key</span><span className="kf-v">{c.vendorKey}</span></div>
          <div className="keyfield"><span className="kf-k">User key</span><span className="kf-v">{c.userKey}</span></div>
          <div className="keyfield"><span className="kf-k">State</span><span className="kf-v">{c.state}</span></div>
          <div className="keyfield"><span className="kf-k">Last sync</span><span className="kf-v">{c.lastSync}</span></div>
          <div className="actions" style={{ marginTop: 16 }}>
            <button className="btn disabled" onClick={() => flash('Both the vendor key and the user key must be set before a connection test can run.')}>Test connection</button>
            <span style={{ color: 'var(--k-tertiary)', fontSize: 12 }}>Keys are supplied by the operator, never stored in the prototype.</span>
          </div>
        </div>
      </>
    );
  }

  if (view === 'sales') {
    return (
      <>
        <p className="lead">Wholesale receipts. CedarGrowth is a processor, so a sale records the package handed to a dispensary, not a retail transaction.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">Receipt</th><th scope="col">Date</th><th scope="col">Counterparty</th><th scope="col">Packages</th><th scope="col">Quantity</th><th scope="col">Recorded</th></tr></thead>
          <tbody>
            {data.sales.map((s) => (
              <tr key={s.id}><td className="mono">{s.id}</td><td className="mono">{s.date}</td><td>{s.party}</td><td className="mono">{s.pkgs.map((id) => { const p = data.packages.find((x) => x.id === id); return p ? p.tag.slice(-4) : id; }).join(', ')}</td><td className="mono">{s.qty} {s.uom}</td><td>{s.recorded ? <span className="chip pass"><span className="sq pass" />Recorded</span> : <span className="chip attention">Pending</span>}</td></tr>
            ))}
          </tbody>
        </table></div>
      </>
    );
  }

  if (view === 'skus') {
    return (
      <>
        <p className="lead">Product SKUs mapped to Metrc items. Each SKU carries a category and unit and links to its live packages.</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th scope="col">SKU</th><th scope="col">Metrc item</th><th scope="col">Category</th><th scope="col">Unit</th><th scope="col">Packages</th></tr></thead>
          <tbody>{data.skus.map((s) => <tr key={s.sku}><td className="mono">{s.sku}</td><td>{s.item}</td><td>{s.cat}</td><td className="mono">{s.unit}</td><td className="mono">{String(s.pkgs).padStart(2, '0')}</td></tr>)}</tbody>
        </table></div>
      </>
    );
  }

  if (view === 'alerts') {
    return (
      <>
        <p className="lead">Discrepancies, test failures, missing manifests, and connection gaps. Acknowledging an alert records the decision to the Command feed.</p>
        {data.alerts.map((a) => (
          <div className="alert-row" key={a.id}>
            <span className={`stripe ${a.sev}`} />
            <div className="body"><div className="a-sub">{a.kind} . {a.subject}</div><div className="a-det">{a.detail}</div></div>
            <div>{a.status === 'open' ? <button className="btn" onClick={() => ack(a.id)}>Acknowledge</button> : <span className="chip pass"><span className="sq pass" />Acknowledged</span>}</div>
          </div>
        ))}
      </>
    );
  }

  if (view === 'trace') {
    const tag = traceTag || (data.packages[0] ? data.packages[0].tag : '');
    const chain = traceFor(data, tag);
    return (
      <>
        <p className="lead">Seed to sale trace. Pick a package and read its lineage from source material to the sale. This is the TraceProvider seam made visible.</p>
        <div className="field" style={{ maxWidth: 520, marginBottom: 12 }}><label>Package tag</label>
          <select value={tag} onChange={(e) => setTraceTag(e.target.value)}>{data.packages.map((p) => <option key={p.id} value={p.tag}>{p.tag} . {p.item}</option>)}</select>
        </div>
        {chain ? <TraceChain c={chain} /> : <div className="empty">No package matches that tag.</div>}
      </>
    );
  }

  return null;
}

function PackageDetail({ p, flash }: { p: Pkg; flash: (m: string) => void }) {
  const rel = releasable(p);
  return (
    <div className="detailpanel">
      <h3>{p.tag}</h3>
      <div className="keyfield"><span className="kf-k">Item</span><span className="kf-v">{p.item}</span></div>
      <div className="keyfield"><span className="kf-k">Source harvest</span><span className="kf-v">{p.harvest}</span></div>
      <div className="keyfield"><span className="kf-k">Laboratory</span><span className="kf-v">{p.lab}</span></div>
      <div className="keyfield"><span className="kf-k">Potency</span><span className="kf-v">{p.potency}</span></div>
      <div className="keyfield"><span className="kf-k">Test state</span><span className="kf-v">{p.test} {gateChip(p.test)}</span></div>
      <div className="actions" style={{ marginTop: 16 }}>
        {rel ? <span className="gate ok"><span className="sq pass" />Ready to prepare a transfer</span> : <button className="btn disabled" onClick={() => flash(`Package ${p.tag} is ${p.test}. Only TestPassed or RetestPassed packages can be transferred.`)}>Prepare transfer</button>}
      </div>
    </div>
  );
}

function TransferDetail({ t, data, ack }: { t: Transfer; data: ProdData; ack: (id: string) => void }) {
  const v = variance(t);
  const over = overThreshold(t);
  const lines = t.pkgs.map((pid) => data.packages.find((p) => p.id === pid)).filter(Boolean) as Pkg[];
  return (
    <div className="detailpanel">
      <h3>Manifest {t.manifest}</h3>
      <div className="keyfield"><span className="kf-k">Direction</span><span className="kf-v">{t.dir}</span></div>
      <div className="keyfield"><span className="kf-k">Counterparty</span><span className="kf-v">{t.party}</span></div>
      <div className="keyfield"><span className="kf-k">Status</span><span className="kf-v">{t.status}</span></div>
      <div className="keyfield"><span className="kf-k">Manifest quantity</span><span className="kf-v">{t.manifestQty} . received {t.receivedQty == null ? 'UNKNOWN' : t.receivedQty}</span></div>
      <div className="keyfield"><span className="kf-k">Variance</span><span className="kf-v" style={{ color: over ? 'var(--k-fail)' : 'var(--k-primary)' }}>{v == null ? 'UNKNOWN' : `${v} percent`} {over ? `exceeds ${THRESHOLD_PCT} percent threshold` : ''}</span></div>
      <div className="label" style={{ marginTop: 16, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--k-tertiary)' }}>Manifest lines</div>
      <div className="tbl-wrap" style={{ marginTop: 10 }}><table className="tbl">
        <thead><tr><th scope="col">Tag</th><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Gate</th></tr></thead>
        <tbody>{lines.map((p) => <tr key={p.id}><td className="mono">{p.tag}</td><td>{p.item}</td><td className="mono">{p.qty} {p.uom}</td><td>{gateChip(p.test)}</td></tr>)}</tbody>
      </table></div>
      {t.manifest === 'UNKNOWN' ? <div className="actions" style={{ marginTop: 16 }}><span className="gate no"><span className="sq fail" />No manifest. This transfer cannot depart.</span></div> : null}
      {over ? <div className="actions" style={{ marginTop: 16 }}><button className="btn solid" onClick={() => ack('A-1')}>Acknowledge discrepancy</button></div> : null}
    </div>
  );
}

function TraceChain({ c }: { c: NonNullable<ReturnType<typeof traceFor>> }) {
  const node = (k: string, v: string, m: string) => (
    <div className="trace-node" style={{ border: '1px solid var(--k-hairline)', background: 'var(--k-parchment)', padding: '14px 16px', maxWidth: 520 }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--k-tertiary)' }}>{k}</div>
      <div className="mono" style={{ fontSize: 13, color: 'var(--k-primary)', marginTop: 4 }}>{v}</div>
      <div style={{ fontSize: 12, color: 'var(--k-tertiary)', marginTop: 4 }}>{m}</div>
    </div>
  );
  const link = <div style={{ width: 1, height: 18, background: 'var(--k-hairline)', marginLeft: 24 }} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
      {node('Source material', c.harvest ? c.harvest.source : 'UNKNOWN', c.harvest ? `Run ${c.harvest.id} . ${c.harvest.name}` : 'UNKNOWN')}
      {link}
      {node('Harvest', c.harvest ? `${c.harvest.id} . ${c.harvest.stage}` : 'UNKNOWN', c.harvest ? `Wet ${c.harvest.wet} . dry ${c.harvest.dry}` : 'UNKNOWN')}
      {link}
      {node('Package', c.pkg.tag, `${c.pkg.item} . ${c.pkg.test}`)}
      {link}
      {node('Transfer', c.transfer ? `Manifest ${c.transfer.manifest}` : 'No outbound transfer yet', c.transfer ? `${c.transfer.party} . ${c.transfer.status}` : 'Package still in inventory')}
      {link}
      {node('Sale', c.sale ? `${c.sale.id} . ${c.sale.date}` : 'No sale recorded', c.sale ? `${c.sale.party} . ${c.sale.qty} ${c.sale.uom}` : 'Not yet handed to a dispensary')}
    </div>
  );
}
