// Printing (CG Prompt 09D Section 10). Somebody will print an SOP and tape it to
// a press; that is what happens on a floor, not a failure of discipline. The
// mitigation is standard and made automatic here: every printed page carries the
// document number, the version, the print date, and a line stating that printed
// copies are uncontrolled and the current version is in Practice. Superseded
// documents cannot be printed at all.

import type { DocStatus } from './types';

// The footer rendered on every printed page. Automatic and not removable.
export function printFooter(documentNumber: string, version: string, printDate: string): string {
  return `${documentNumber} v${version} . PRINTED ${printDate} . PRINTED COPIES ARE UNCONTROLLED . VERIFY THE CURRENT VERSION IN PRACTICE`;
}

// A superseded or withdrawn version cannot be printed at all.
export function canPrint(versionStatus: DocStatus): { ok: boolean; reason: string | null } {
  if (versionStatus === 'SUPERSEDED' || versionStatus === 'WITHDRAWN') {
    return { ok: false, reason: `a ${versionStatus.toLowerCase()} version cannot be printed` };
  }
  return { ok: true, reason: null };
}
