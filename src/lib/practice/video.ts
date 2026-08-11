// Video delivery seam (CG Prompt 09C Section 4). All video access goes through
// a VideoProvider: signed expiring URLs tied to the session, never public,
// never guessable; playback verified completion; and offline capability whose
// completion records carry the true completion timestamp, never the sync time.
// This build ships the seam and a mock adapter. A real adapter follows once the
// provider is chosen.

import type { ModuleCompletion, PlaybackEvent } from './modules';

export type WatchRecord = {
  videoRef: string;
  watchedPercent: number; // true watched coverage, not furthest position reached
  trail: PlaybackEvent[];
};

export type OfflineResult = { ok: boolean; note: string };

export interface VideoProvider {
  // A signed URL that expires and is tied to the session. Never a stable public
  // link.
  getPlaybackUrl(videoRef: string, sessionId: string): Promise<string>;
  // Record a real playback progress event. The provider accumulates watched
  // coverage; a forward seek does not add coverage for skipped content.
  recordProgress(videoRef: string, event: PlaybackEvent): Promise<void>;
  getWatchRecord(videoRef: string): Promise<WatchRecord>;
  // Stage a module for offline completion on the floor.
  downloadForOffline(videoRef: string): Promise<OfflineResult>;
}

// The true completion time survives an offline sync. Reconciling an offline
// completion sets syncedAt to when it reached the server and leaves completedAt
// untouched, so a record made without signal keeps its real timestamp.
export function reconcileOfflineCompletion(
  offline: Omit<ModuleCompletion, 'syncedAt'>,
  syncAt: string,
): ModuleCompletion {
  return { ...offline, syncedAt: syncAt };
}

// In-memory mock. No signed infrastructure, no fabricated watch data: a watch
// record starts empty and accumulates only the events recorded against it.
export class MockVideoProvider implements VideoProvider {
  private records = new Map<string, WatchRecord>();

  async getPlaybackUrl(videoRef: string, sessionId: string): Promise<string> {
    // A mock stand in for a signed, expiring, session tied URL. It is not a real
    // credential and grants no access; the real adapter returns a signed URL.
    return `mock-video://${videoRef}?session=${sessionId}&expires=UNKNOWN`;
  }

  async recordProgress(videoRef: string, event: PlaybackEvent): Promise<void> {
    const rec = this.records.get(videoRef) ?? { videoRef, watchedPercent: 0, trail: [] };
    rec.trail.push(event);
    // Watched coverage only ever increases to the true coverage reported; a
    // forward seek reports the same coverage, not the new position.
    rec.watchedPercent = Math.max(rec.watchedPercent, event.watchedPercent);
    this.records.set(videoRef, rec);
  }

  async getWatchRecord(videoRef: string): Promise<WatchRecord> {
    return this.records.get(videoRef) ?? { videoRef, watchedPercent: 0, trail: [] };
  }

  async downloadForOffline(videoRef: string): Promise<OfflineResult> {
    return { ok: true, note: `staged ${videoRef} for offline completion` };
  }
}
