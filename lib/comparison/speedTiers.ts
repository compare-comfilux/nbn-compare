/**
 * Standard advertised NBN speed tiers (Mbps download), used for the
 * "I know exactly what speed I want" quick path on /compare/by-speed.
 *
 * These are the common tiers nbn wholesale offers; not every tier will
 * necessarily have a matching plan in the current (demo) database —
 * see getPlansBySpeedTier's availableTiers fallback for that case.
 */
export const SPEED_TIERS = [25, 50, 100, 250, 500, 1000] as const;

export type SpeedTier = (typeof SPEED_TIERS)[number];

export function isValidSpeedTier(value: number): value is SpeedTier {
  return (SPEED_TIERS as readonly number[]).includes(value);
}
