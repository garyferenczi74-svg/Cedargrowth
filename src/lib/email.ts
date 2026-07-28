import { Resend } from 'resend';

export type ReservationItem = {
  slug: string;
  name: string;
  spec: string;
  qty: number;
};

export type ReservationEmailData = {
  name: string;
  email: string;
  location: string;
  note: string;
  items: ReservationItem[];
  itemCount: number;
};

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemsTable(items: ReservationItem[]): string {
  const rows = items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.spec)}</td><td>${i.qty}</td></tr>`,
    )
    .join('');
  return `<table cellpadding="6" style="border-collapse:collapse"><thead><tr><th align="left">Product</th><th align="left">Spec</th><th align="left">Qty</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// Internal alert to the CedarGrowth inbox. Skips cleanly if env is missing.
export async function sendReservationAlert(data: ReservationEmailData): Promise<void> {
  const resend = getResend();
  const to = process.env.RESERVATION_ALERT_TO;
  const from = process.env.RESERVATION_ALERT_FROM;
  if (!resend || !to || !from) {
    console.warn('Reservation alert skipped, email env not configured');
    return;
  }
  try {
    await resend.emails.send({
      from,
      to,
      subject: `New reservation request, ${data.name}`,
      html:
        `<p>New reservation request.</p>` +
        `<p>Name: ${escapeHtml(data.name)}<br>` +
        `Email: ${escapeHtml(data.email)}<br>` +
        `Location: ${escapeHtml(data.location)}<br>` +
        `Items reserved: ${data.itemCount}</p>` +
        (data.note ? `<p>Note: ${escapeHtml(data.note)}</p>` : '') +
        itemsTable(data.items),
    });
  } catch (err) {
    console.error('Reservation alert email failed', err);
  }
}

// Confirmation to the customer. House voice, no compound names, no payment claim.
export async function sendCustomerConfirmation(data: ReservationEmailData): Promise<void> {
  const resend = getResend();
  const from = process.env.RESERVATION_ALERT_FROM;
  if (!resend || !from) {
    console.warn('Customer confirmation skipped, email env not configured');
    return;
  }
  try {
    await resend.emails.send({
      from,
      to: data.email,
      subject: 'Your CedarGrowth reservation request',
      html:
        `<p>Thank you, ${escapeHtml(data.name)}.</p>` +
        `<p>We received your reservation request. This is a request, not a sale. ` +
        `A CedarGrowth coordinator confirms availability and routes it to the nearest ` +
        `dispensary that carries CedarGrowth. No payment was taken.</p>` +
        itemsTable(data.items),
    });
  } catch (err) {
    console.error('Customer confirmation email failed', err);
  }
}
