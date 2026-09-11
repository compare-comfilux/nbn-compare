/**
 * Provider name -> verified official domain.
 *
 * The plans API gives us no logo or website field, so this mapping is
 * how we know which real domain to pull a provider's logo from. Every
 * entry here was individually verified (not guessed) before being
 * added — getting this wrong means showing the wrong company's logo,
 * which is worse than showing none. Providers not listed here fall
 * back to the initials avatar (see ProviderLogo.tsx) rather than a
 * best-guess domain.
 *
 * To add a provider: confirm their real domain yourself, then add a
 * lowercase key here. Matching is substring-based against the plan's
 * `provider` field so "Tangerine" and "Tangerine Telecom" both match
 * the same entry.
 */
export const PROVIDER_DOMAINS: Record<string, string> = {
  "aussie broadband": "aussiebroadband.com.au",
  tpg: "tpg.com.au",
  telstra: "telstra.com.au",
  optus: "optus.com.au",
  iinet: "iinet.net.au",
  superloop: "superloop.com",
  tangerine: "tangerine.com.au",
  belong: "belong.com.au",
  dodo: "dodo.com",
  spintel: "spintel.net.au",
  iprimus: "iprimus.com.au",
  "southern phone": "southernphone.com.au",
  exetel: "exetel.com.au",
  vodafone: "vodafone.com.au",
  launtel: "launtel.net.au",
};

export function getProviderDomain(providerName: string): string | undefined {
  const normalized = providerName.trim().toLowerCase();
  for (const [key, domain] of Object.entries(PROVIDER_DOMAINS)) {
    if (normalized.includes(key)) return domain;
  }
  return undefined;
}
