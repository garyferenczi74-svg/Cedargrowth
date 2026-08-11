// External content seam (CG Prompt 09C Section 8). Generic occupational safety
// content will be purchased, so this seam has a known consumer. A
// ContentPackageProvider imports a package, stores it, launches it in the
// player, and receives completion and score events back. A SCORM 1.2 and 2004
// adapter implements it; this build ships the interface and a mock adapter.
//
// External modules carry the same record discipline as internal ones: completion
// is evidence, append only, timestamped, and attributed. A package with
// TEACHES: NONE is legitimate, because generic safety content teaches no
// CedarGrowth document, but it still expires, still reassigns, and still reports.

export type ScormVersion = '1.2' | '2004';

export type ImportedPackage = {
  packageId: string;
  name: string;
  scorm: ScormVersion;
  importedAt: string;
};

// A completion coming back from the package. The score is optional: not every
// package reports one, and a missing score is UNKNOWN, never zero.
export type PackageCompletionEvent = {
  packageId: string;
  personId: string;
  completedAt: string;
  score: number | null;
};

export interface ContentPackageProvider {
  importPackage(name: string, scorm: ScormVersion, importedAt: string): Promise<ImportedPackage>;
  launch(packageId: string, sessionId: string): Promise<{ launchUrl: string }>;
  // The player registers a handler; the provider calls it when the package
  // reports completion. Returns the last event seen, or null if none yet.
  lastCompletion(packageId: string): Promise<PackageCompletionEvent | null>;
}

// In-memory mock. Imports are tracked; no fabricated completions or scores are
// produced. lastCompletion returns null until a real event is recorded through
// recordCompletion, which the real adapter drives from the SCORM runtime.
export class MockContentPackageProvider implements ContentPackageProvider {
  private packages = new Map<string, ImportedPackage>();
  private completions = new Map<string, PackageCompletionEvent>();
  private counter = 0;

  async importPackage(name: string, scorm: ScormVersion, importedAt: string): Promise<ImportedPackage> {
    this.counter += 1;
    const pkg: ImportedPackage = { packageId: `pkg-${this.counter}`, name, scorm, importedAt };
    this.packages.set(pkg.packageId, pkg);
    return pkg;
  }

  async launch(packageId: string, sessionId: string): Promise<{ launchUrl: string }> {
    return { launchUrl: `mock-scorm://${packageId}?session=${sessionId}` };
  }

  // Test and real-adapter hook: record a genuine completion event from the
  // runtime. Not seed data, and not called at import.
  recordCompletion(event: PackageCompletionEvent): void {
    this.completions.set(event.packageId, event);
  }

  async lastCompletion(packageId: string): Promise<PackageCompletionEvent | null> {
    return this.completions.get(packageId) ?? null;
  }
}
