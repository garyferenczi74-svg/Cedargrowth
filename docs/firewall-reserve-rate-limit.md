# Firewall rule: rate limit POST /api/reserve

Status: APPLIED and live in production since 2026-08-04. Live rule id `rule_rate_limit_reservation_endpoint_LzYeGM`, created via the Vercel firewall REST API (5 req / 60s per IP on POST /api/reserve, action deny; enforcement verified). This file is the tracked reference for that rule.

## Why

`POST /api/reserve` is a public, unauthenticated write endpoint (`src/app/api/reserve/route.ts`). It inserts a row into `reservations` and fires two outbound emails per call (`sendReservationAlert` + `sendCustomerConfirmation`). Today there is no rate limiting anywhere:

- No limiter in the route.
- `src/middleware.ts` only matches `/admin/kelvin/*`, not `/api/reserve`.
- `vercel.json` has no firewall config.

The existing honeypot field (`company`) blocks naive bots but does nothing against volume. A Vercel WAF rate-limit rule closes that gap and doubles as email-amplification protection. The honeypot stays in place as a second layer.

## Recommended parameters

| Field        | Value              | Reason |
|--------------|--------------------|--------|
| Match path   | `/api/reserve` (eq) | The endpoint only |
| Match method | `POST` (eq)         | The only method the route handles |
| Algorithm    | `fixed_window`      | Simple, predictable |
| Window       | `60` seconds        | Per-minute cap |
| Limit        | `5` requests        | A real user submits 1 to 2 times; 5 per minute is generous headroom |
| Key          | `ip`                | Per-client bucket. The rate-limit key value is `ip`, NOT `ip_address` (see note) |
| Exceed action| `deny`              | See note below |

IMPORTANT (rate-limit key gotcha): the rate-limit key must be `ip`, not `ip_address`. `ip_address` is a valid firewall CONDITION type but an invalid rate-limit key. Vercel accepts a rule with `keys: ["ip_address"]` as valid (valid=true, no validationErrors) but it silently never enforces, so requests pass through unthrottled. Confirmed 2026-08-04: `ip_address` = inert, `ip` = enforcing.

Use `deny`, not `challenge`. The form calls this endpoint via `fetch`, and a managed challenge page cannot be solved inside a background XHR, so it would just break legitimate retries. `deny` returns a clean block that the form error state can handle. Only switch to `challenge` if a visible captcha step is added later.

## Option 1: Dashboard

Vercel > project `cedargrowth` > Firewall > Configure > Custom Rule:

1. Name: `Rate limit reservation endpoint`
2. If: Request Path Equals `/api/reserve`, And Request Method Equals `POST`
3. Then: Rate Limit, 5 requests per 60s, Fixed window, key by IP Address
4. When exceeded: Deny
5. Save, then Publish (rules stay in draft until published).

## Option 2: CLI

```bash
vercel firewall rules add "Rate limit reservation endpoint" \
  --condition 'path eq /api/reserve' \
  --condition 'method eq POST' \
  --action rate_limit \
  --rate-limit-window 60s \
  --rate-limit-requests 5 \
  --rate-limit-keys ip \
  --rate-limit-algo fixed_window \
  --rate-limit-action deny
```

## Option 3: REST / SDK payload (rules.insert)

Conditions inside one `conditionGroup` are AND-ed, so this matches path and POST together. `window` is in seconds.

```json
{
  "action": "rules.insert",
  "id": null,
  "value": {
    "active": true,
    "name": "Rate limit reservation endpoint",
    "description": "Throttle POST /api/reserve to curb bulk/abuse submissions and email amplification",
    "conditionGroup": [
      {
        "conditions": [
          { "type": "path",   "op": "eq", "value": "/api/reserve" },
          { "type": "method", "op": "eq", "value": "POST" }
        ]
      }
    ],
    "action": {
      "mitigate": {
        "action": "rate_limit",
        "rateLimit": {
          "algo": "fixed_window",
          "window": 60,
          "limit": 5,
          "keys": ["ip"],
          "action": "deny"
        },
        "actionDuration": null,
        "redirect": null
      }
    }
  }
}
```

## Optional second tier (slow-drip abuse)

Add a firmer hourly cap alongside the burst rule. Same conditions, but 30 requests per 3600s per IP, action deny, with `actionDuration: "1h"` so a tripped IP stays blocked for an hour. Skip unless you want belt and suspenders.

## After publishing: verify

```bash
# 7 rapid POSTs; expect the first 5 to reach the app, then blocks.
for i in $(seq 1 7); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST https://cedargrowth.vercel.app/api/reserve \
    -H 'content-type: application/json' --data '{}'
done
```

Expect `400` (bad body, but the request reached the app) for the first 5, then `403` once the limit trips. Confirm in Firewall > Observability that the rule is counting.

## Caveats

- Plan: WAF rate-limiting rules need Pro or Enterprise with Firewall enabled. The ViaConnect team should qualify; confirm if the option is greyed out.
- Shared NAT: a corporate office or mobile carrier can put many users behind one IP. `5/min` is loose enough that this is unlikely to bite. If false blocks appear, raise the limit or add `ja4_digest` as a second key.
- Domain: as of this writing `cedargrowth.com` still points at GoDaddy parking, not Vercel. Test against `cedargrowth.vercel.app` until the domain is wired to Vercel.

## Verification record

The three seed "findings" that prompted this were checked against the repo:

- Reserve endpoint unthrottled: REAL. Confirmed no rate limit in the route, middleware, or `vercel.json`. Fixed live 2026-08-04 by the WAF rule described above (rule id `rule_rate_limit_reservation_endpoint_LzYeGM`).
- Age gate renders after content: FICTION. The gate is flag-gated off (`src/lib/flags.ts`, `isAgeGateEnabled()` defaults off) and mounts before content when on (`src/app/layout.tsx`). Real open item is the launch policy decision, not a rendering bug.
- Metrc two key auth unset: DEMO ONLY. Metrc exists only in the KELVIN prototype wing (`src/app/admin/kelvin/wings/production.ts`), not as a real integration.
