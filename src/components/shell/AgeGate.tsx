'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ageGate } from '@/content/ageGate';

// Full screen 21 plus age gate (spec Section C item 6). Only mounted when
// src/lib/flags.ts#isAgeGateEnabled() is true; the guard lives at the mount
// site in the root layout, not in this component, so a flag-off render tree
// never references this module and adds zero DOM.
//
// Entry is month plus year of birth, not a yes/no button. On a passing entry
// the gate records the pass in sessionStorage, which is scoped to the tab and
// cleared the moment that tab is closed. Closing the site and reopening it
// therefore always re-prompts, and a fresh tab always re-prompts, which is the
// intended behavior. (A session cookie was too sticky here: cookies are shared
// across every tab, survive a tab close, and Chrome's "continue where you left
// off" restores them across a full browser restart, so the gate rarely came
// back.) That retention is also stated to the visitor in ageGate.retentionNote.
//
// The legal and accessibility links are reachable without ever submitting
// the form, so a visitor can read either page before, or instead of,
// confirming their age. /legal/terms and /legal/accessibility are real
// routes (as are /legal/privacy and /legal/compliance). AgeGate also
// renders null for any pathname starting with /legal (see the early return
// below), so all four legal pages stay reachable even when the gate is
// enabled and no passing entry has been recorded yet.

const STORAGE_KEY = 'cg_age_verified';
const MIN_AGE = 21;

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
] as const;

function currentYear(): number {
  return new Date().getFullYear();
}

function yearOptions(): number[] {
  const max = currentYear();
  const min = max - 100;
  const years: number[] = [];
  for (let y = max; y >= min; y -= 1) years.push(y);
  return years;
}

// Age from month plus year only, measured against the first of the birth
// month. A day-of-month is never collected, so this is intentionally the
// conservative reading (it cannot overstate age).
function ageFromMonthYear(month: number, year: number): number {
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  let age = nowYear - year;
  if (nowMonth < month) age -= 1;
  return age;
}

function hasSessionPass(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // sessionStorage can throw in hardened privacy modes; treat that as
    // not-yet-verified so the gate still shows rather than silently passing.
    return false;
  }
}

function setSessionPass(): void {
  // sessionStorage is per-tab and cleared on tab close, so a returning visit
  // re-prompts. Wrapped because it can throw when storage is disabled.
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // If we cannot persist, the in-memory verified state below still lets the
    // current view through; the next load will simply re-prompt.
  }
}

export function AgeGate() {
  const pathname = usePathname();
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [verified, setVerified] = useState(false);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVerified(hasSessionPass());
    setCheckedStorage(true);
  }, []);

  // Nothing renders until the storage check has run once, nothing renders
  // once a passing entry has been recorded for this session, and nothing
  // renders on /legal/* routes: those pages must stay reachable even before
  // a visitor has confirmed their age.
  if (!checkedStorage || verified || pathname?.startsWith('/legal')) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const monthValue = Number(month);
    const yearValue = Number(year);
    const years = yearOptions();
    const monthValid = Number.isInteger(monthValue) && monthValue >= 1 && monthValue <= 12;
    const yearValid = Number.isInteger(yearValue) && years.includes(yearValue);

    if (!monthValid || !yearValid) {
      setError(ageGate.errorInvalid);
      return;
    }

    const age = ageFromMonthYear(monthValue, yearValue);
    if (age < MIN_AGE) {
      setError(ageGate.errorUnderage);
      return;
    }

    setError(null);
    setSessionPass();
    setVerified(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-heading"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-parchment px-page-margin-mobile py-16 md:px-page-margin"
    >
      <div className="flex w-full max-w-editorial flex-col gap-8 border border-hairline bg-parchment p-8 md:p-12">
        <div className="flex flex-col gap-4">
          <p className="font-sans font-medium text-eyebrow-m uppercase text-tertiary md:text-eyebrow">
            {ageGate.eyebrow}
          </p>
          <h1
            id="age-gate-heading"
            className="font-display text-heading-m-m text-primary md:text-heading-m"
          >
            {ageGate.headline}
          </h1>
          <p className="text-body-m-m text-secondary md:text-body-m">{ageGate.body}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="age-gate-month"
                className="font-mono text-specimen uppercase tracking-specimen text-tertiary"
              >
                {ageGate.monthLabel}
              </label>
              <select
                id="age-gate-month"
                name="month"
                required
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="border-b border-hairline bg-transparent py-2 text-body-m-m text-primary focus-visible:border-cedar focus-visible:outline-none md:text-body-m"
              >
                <option value="" disabled>
                  Select
                </option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="age-gate-year"
                className="font-mono text-specimen uppercase tracking-specimen text-tertiary"
              >
                {ageGate.yearLabel}
              </label>
              <select
                id="age-gate-year"
                name="year"
                required
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="border-b border-hairline bg-transparent py-2 text-body-m-m text-primary focus-visible:border-cedar focus-visible:outline-none md:text-body-m"
              >
                <option value="" disabled>
                  Select
                </option>
                {yearOptions().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <p className="text-caption-m text-fail md:text-caption" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="cg-btn self-start"
          >
            {ageGate.submitCta}
          </button>

          <p className="text-caption-m text-tertiary md:text-caption">{ageGate.retentionNote}</p>
        </form>

        <div className="flex flex-col gap-3 border-t border-hairline pt-6">
          <p className="text-caption-m text-tertiary md:text-caption">{ageGate.exitNote}</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/legal/terms"
              className="cedar-underline text-caption uppercase tracking-eyebrow text-primary"
            >
              {ageGate.legalCta}
            </Link>
            <Link
              href="/legal/accessibility"
              className="cedar-underline text-caption uppercase tracking-eyebrow text-primary"
            >
              {ageGate.accessibilityCta}
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
