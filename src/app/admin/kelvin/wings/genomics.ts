// Genomics wing store. Counts and status only. No method returns a genetic
// result. readResult exists solely to prove the refusal is structural, not a
// setting: it returns the same statement for every caller and every kit, because
// there is no owner override. Subjects are anonymized tokens, never names.

export type Kit = { id: string; subject: string; status: string; consent: string; lab: string; ordered: string; result: string; delivery: string };

const KITS: Kit[] = [
  { id: 'K-1001', subject: 'SUBJ-4471', status: 'At lab', consent: 'Granted', lab: 'Genome Node', ordered: '07-22', result: 'Pending', delivery: 'Pending' },
  { id: 'K-1002', subject: 'SUBJ-4472', status: 'Delivered', consent: 'Granted', lab: 'Genome Node', ordered: '07-15', result: 'Sealed', delivery: 'Delivered' },
  { id: 'K-1003', subject: 'SUBJ-4473', status: 'Shipped', consent: 'Granted', lab: 'UNKNOWN', ordered: '07-28', result: 'Pending', delivery: 'Pending' },
  { id: 'K-1004', subject: 'SUBJ-4474', status: 'Ordered', consent: 'Pending', lab: 'UNKNOWN', ordered: '07-31', result: 'Pending', delivery: 'Pending' },
  { id: 'K-1005', subject: 'SUBJ-4475', status: 'Resulted', consent: 'Withdrawn', lab: 'Genome Node', ordered: '07-12', result: 'Sealed', delivery: 'Held' },
  { id: 'K-1006', subject: 'SUBJ-4476', status: 'Resulted', consent: 'Granted', lab: 'Genome Node', ordered: '07-20', result: 'Sealed', delivery: 'Pending' },
];

const k = (id: string) => KITS.find((x) => x.id === id) || null;

export const Genomics = {
  listKits: () => KITS.slice(),
  getKit: (id: string) => k(id),
  countsByStatus: () => {
    const m: Record<string, number> = {};
    KITS.forEach((x) => { m[x.status] = (m[x.status] || 0) + 1; });
    return m;
  },
  consentCounts: () => {
    const m: Record<string, number> = { Granted: 0, Pending: 0, Withdrawn: 0 };
    KITS.forEach((x) => { m[x.consent] = (m[x.consent] || 0) + 1; });
    return m;
  },
  resultedCount: () => KITS.filter((x) => x.result === 'Sealed').length,
  deliveredCount: () => KITS.filter((x) => x.delivery === 'Delivered').length,
  markShipped: (id: string) => {
    const x = k(id);
    if (x && x.status === 'Ordered') x.status = 'Shipped';
    return x;
  },
  readResult: () => 'Unreadable. Individual genetic results are not readable from any administrative context, and there is no override.',
};
