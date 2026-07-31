// Editorial wing store. APERTURE drafts, SENTINEL clears, Owner approves, then
// schedule and publish. The clearance gate lives here: a draft cannot clear while
// its dictionary scan is flagged, the Marshall scan as a hard block. The chain
// Draft to Clearance to Approval to Schedule to Publish is enforced by stage.

export type Draft = { id: string; title: string; author: string; stage: string; scan: string; flag: string; blocker: string; pubDate: string };
export type Research = { id: string; topic: string; source: string; status: string };

export const STAGES = ['Draft', 'In clearance', 'Cleared', 'Approved', 'Scheduled', 'Published'];
let seq = 7;

const DRAFTS: Draft[] = [
  { id: 'D-01', title: 'Cold cure, dried and washed', author: 'APERTURE', stage: 'In clearance', scan: 'clean', flag: '', blocker: 'Awaiting SENTINEL originality check.', pubDate: 'UNKNOWN' },
  { id: 'D-02', title: 'The thirteen traits, plain language', author: 'APERTURE', stage: 'Draft', scan: 'clean', flag: '', blocker: 'Blocked on trait matrix v2 sign off.', pubDate: 'UNKNOWN' },
  { id: 'D-03', title: 'Fresh frozen and the aromatics drying takes', author: 'APERTURE', stage: 'Cleared', scan: 'clean', flag: '', blocker: '', pubDate: 'UNKNOWN' },
  { id: 'D-04', title: 'Terpenes, read like a library', author: 'APERTURE', stage: 'Approved', scan: 'clean', flag: '', blocker: '', pubDate: 'UNKNOWN' },
  { id: 'D-05', title: 'Why we do not name a strain', author: 'APERTURE', stage: 'Scheduled', scan: 'clean', flag: '', blocker: '', pubDate: '08-04' },
  { id: 'D-06', title: 'The wash, cold and slow', author: 'APERTURE', stage: 'Published', scan: 'clean', flag: '', blocker: '', pubDate: '07-28' },
  { id: 'D-07', title: 'A note on potency', author: 'APERTURE', stage: 'In clearance', scan: 'flagged', flag: 'Dictionary scan hit. A banned efficacy term appears in paragraph two.', blocker: '', pubDate: 'UNKNOWN' },
];
const RESEARCH: Research[] = [
  { id: 'RS-01', topic: 'Endocannabinoid tone, review', source: 'Journal roundup', status: 'Open' },
  { id: 'RS-02', topic: 'Terpene synergy, evidence base', source: 'Hounddog scrape', status: 'In draft' },
  { id: 'RS-03', topic: 'Cold water hash yield factors', source: 'Method notes', status: 'Open' },
];

const d = (id: string) => DRAFTS.find((x) => x.id === id) || null;

export const Editorial = {
  STAGES,
  stageIndex: (s: string) => STAGES.indexOf(s),
  listDrafts: () => DRAFTS.slice(),
  getDraft: (id: string) => d(id),
  countsByStage: () => {
    const m: Record<string, number> = {};
    STAGES.forEach((s) => { m[s] = 0; });
    DRAFTS.forEach((x) => { m[x.stage] = (m[x.stage] || 0) + 1; });
    return m;
  },
  inClearance: () => DRAFTS.filter((x) => x.stage === 'In clearance'),
  cleared: () => DRAFTS.filter((x) => x.stage === 'Cleared'),
  approved: () => DRAFTS.filter((x) => x.stage === 'Approved'),
  scheduled: () => DRAFTS.filter((x) => x.stage === 'Scheduled'),
  published: () => DRAFTS.filter((x) => x.stage === 'Published'),
  clearDraft: (id: string): { ok: boolean; reason?: string; draft?: Draft } => {
    const x = d(id);
    if (!x) return { ok: false, reason: 'Draft not found.' };
    if (x.stage !== 'In clearance') return { ok: false, reason: `Draft ${id} is not in clearance.` };
    if (x.scan === 'flagged') return { ok: false, reason: `Draft ${id} has a dictionary scan hit. A single banned term is a hard block. It cannot clear until the copy is fixed.` };
    x.stage = 'Cleared';
    return { ok: true, draft: x };
  },
  sendBack: (id: string) => { const x = d(id); if (x) x.stage = 'Draft'; return x; },
  approveDraft: (id: string): { ok: boolean; reason?: string; draft?: Draft } => {
    const x = d(id);
    if (!x) return { ok: false, reason: 'Draft not found.' };
    if (x.stage !== 'Cleared') return { ok: false, reason: `Draft ${id} is ${x.stage}. Only a cleared draft can be approved.` };
    x.stage = 'Approved';
    return { ok: true, draft: x };
  },
  scheduleDraft: (id: string, date: string): { ok: boolean; reason?: string; draft?: Draft } => {
    const x = d(id);
    if (!x) return { ok: false, reason: 'Draft not found.' };
    if (x.stage !== 'Approved') return { ok: false, reason: `Draft ${id} is ${x.stage}. Only an approved draft can be scheduled.` };
    x.stage = 'Scheduled';
    x.pubDate = date || '08-05';
    return { ok: true, draft: x };
  },
  publishDraft: (id: string): { ok: boolean; reason?: string; draft?: Draft } => {
    const x = d(id);
    if (!x) return { ok: false, reason: 'Draft not found.' };
    if (x.stage !== 'Scheduled') return { ok: false, reason: `Draft ${id} is ${x.stage}. Only a scheduled draft can be published.` };
    x.stage = 'Published';
    return { ok: true, draft: x };
  },
  listResearch: () => RESEARCH.slice(),
  promoteResearch: (id: string) => {
    const r = RESEARCH.find((x) => x.id === id);
    if (!r) return null;
    r.status = 'In draft';
    seq += 1;
    const nd: Draft = { id: `D-${String(seq).padStart(2, '0')}`, title: r.topic, author: 'APERTURE', stage: 'Draft', scan: 'clean', flag: '', blocker: `Promoted from research ${r.id}.`, pubDate: 'UNKNOWN' };
    DRAFTS.push(nd);
    return nd;
  },
};
