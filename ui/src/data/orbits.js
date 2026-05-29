// Orbit-abbrev → default inclination mapping, plus great-circle math helpers.

export const ORBIT_INCLINATIONS = {
  // ISO 2-3 letter abbrevs LL2 uses
  LEO:   51.6,   // ISS-like default
  ISS:   51.6,
  SSO:   97.5,   // sun-synchronous
  HEO:   28,     // highly elliptical (varies wildly)
  MEO:   55,     // medium earth (GPS-like)
  GTO:  27.0,    // geostationary transfer
  GEO:   0.0,    // geostationary
  TLI:  28.5,    // trans-lunar (varies)
  Polar: 90.0,
  Direct: 28.5,  // direct insertion (varies)
};

// Mission-name overrides for Starlink shells & similar known cases
const NAME_OVERRIDES = [
  { match: /starlink.*group\s*6/i,   inc: 53 },
  { match: /starlink.*group\s*5/i,   inc: 70 },
  { match: /starlink.*group\s*7/i,   inc: 97 },
  { match: /starlink/i,              inc: 53 },
  { match: /iss|dragon|cygnus|crs-/i, inc: 51.6 },
];

export function getInclination(launch) {
  // Try mission name first
  const name = launch?.name ?? '';
  for (const o of NAME_OVERRIDES) {
    if (o.match.test(name)) return o.inc;
  }
  // Then orbit abbrev
  const abbrev = launch?.mission?.orbit?.abbrev ?? '';
  if (ORBIT_INCLINATIONS[abbrev] != null) return ORBIT_INCLINATIONS[abbrev];
  // Fallback
  return 51.6;
}

export function getPadCoords(launch) {
  const lat = parseFloat(launch?.pad?.latitude);
  const lng = parseFloat(launch?.pad?.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return [lng, lat]; // [lon, lat] for d3-geo
  // Fallback to KSC LC-39A
  return [-80.604, 28.608];
}

// Launch azimuth (radians) to achieve target inclination from given latitude.
// Returns the prograde east-going azimuth (north = 0, east = π/2).
// If target inclination < |latitude|, returns due east (best possible).
export function azimuthForInclination(inclinationDeg, latitudeDeg) {
  const i = inclinationDeg * Math.PI / 180;
  const lat = latitudeDeg * Math.PI / 180;
  const cosLat = Math.cos(lat);
  if (Math.abs(cosLat) < 1e-4) return Math.PI / 2;
  const sinAz = Math.cos(i) / cosLat;
  if (sinAz >= 1) return 0;        // due north
  if (sinAz <= -1) return Math.PI;  // due south
  // Prograde (east-going) — between 0 and π
  // For prograde inclination ≤ 90°, azimuth ∈ (0, π/2) measured from north
  // For retrograde inclination > 90°, azimuth flips to north-of-east-going-south
  if (inclinationDeg <= 90) return Math.asin(sinAz);
  return Math.PI - Math.asin(Math.abs(sinAz));
}

// Compute a great-circle path of `points` segments from `start` [lon, lat]
// in compass direction `azimuth` (rad) for `distanceDeg` of arc.
export function greatCircle(start, azimuth, distanceDeg, points = 96) {
  const lon1 = start[0] * Math.PI / 180;
  const lat1 = start[1] * Math.PI / 180;
  const d = distanceDeg * Math.PI / 180;
  const out = [];
  for (let i = 0; i <= points; i++) {
    const f = (i / points) * d;
    const sinLat2 = Math.sin(lat1) * Math.cos(f) + Math.cos(lat1) * Math.sin(f) * Math.cos(azimuth);
    const lat2 = Math.asin(sinLat2);
    const y = Math.sin(azimuth) * Math.sin(f) * Math.cos(lat1);
    const x = Math.cos(f) - Math.sin(lat1) * sinLat2;
    const lon2 = lon1 + Math.atan2(y, x);
    out.push([(lon2 * 180 / Math.PI + 540) % 360 - 180, lat2 * 180 / Math.PI]);
  }
  return out;
}
