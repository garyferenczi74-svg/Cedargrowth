// Notifications seam (CG Prompt 09D Section 9). Deskless workers frequently have
// no work email and will not install a second app, so the channel is decided
// before the automation, not after. In-app covers people who open Practice; SMS
// covers people who do not. A person with no reachable channel is a gap the
// console shows, because an assignment nobody receives is not an assignment.
// Every notification sent is recorded against the assignment. This build ships
// the seam and a mock adapter; the real provider follows.

export type Channel = 'IN_APP' | 'EMAIL' | 'SMS';

export type NotificationClass = 'ASSIGNMENT' | 'REMINDER' | 'ESCALATION' | 'EXPIRY';

// Preference per person, per notification class. A null channel means no channel
// is reachable for that class.
export type ChannelPreference = {
  personId: string;
  notificationClass: NotificationClass;
  channel: Channel | null;
};

export type DeliveryRecord = {
  id: string;
  assignmentId: string | null;
  personId: string;
  channel: Channel;
  notificationClass: NotificationClass;
  sentAt: string;
};

export interface NotificationProvider {
  send(
    personId: string,
    notificationClass: NotificationClass,
    channel: Channel,
    body: string,
    assignmentId: string | null,
    sentAt: string,
  ): Promise<DeliveryRecord>;
  getPreference(personId: string, notificationClass: NotificationClass): Promise<Channel | null>;
  recordDelivery(rec: Omit<DeliveryRecord, 'id'>): Promise<DeliveryRecord>;
}

// A person is unreachable when they have no channel for any class. The console
// shows them.
export function unreachablePeople(prefs: ChannelPreference[]): string[] {
  const byPerson = new Map<string, boolean>(); // personId -> has any reachable channel
  for (const p of prefs) {
    const reachable = byPerson.get(p.personId) || p.channel !== null;
    byPerson.set(p.personId, reachable);
  }
  return Array.from(byPerson.entries())
    .filter(([, reachable]) => !reachable)
    .map(([personId]) => personId);
}

// In-memory mock. Preferences and deliveries start empty: no fabricated contact
// details, no fabricated deliveries.
export class MockNotificationProvider implements NotificationProvider {
  private prefs = new Map<string, Channel | null>();
  private deliveries: DeliveryRecord[] = [];
  private counter = 0;

  setPreference(personId: string, notificationClass: NotificationClass, channel: Channel | null) {
    this.prefs.set(`${personId}|${notificationClass}`, channel);
  }

  async getPreference(personId: string, notificationClass: NotificationClass): Promise<Channel | null> {
    return this.prefs.get(`${personId}|${notificationClass}`) ?? null;
  }

  async recordDelivery(rec: Omit<DeliveryRecord, 'id'>): Promise<DeliveryRecord> {
    this.counter += 1;
    const full: DeliveryRecord = { ...rec, id: `dlv-${this.counter}` };
    this.deliveries.push(full);
    return full;
  }

  async send(
    personId: string,
    notificationClass: NotificationClass,
    channel: Channel,
    _body: string,
    assignmentId: string | null,
    sentAt: string,
  ): Promise<DeliveryRecord> {
    // The mock records the delivery intent; a real adapter dispatches to the
    // channel and records the provider result.
    return this.recordDelivery({ assignmentId, personId, channel, notificationClass, sentAt });
  }
}
