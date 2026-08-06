export const CIPHER_WORDS = ["AUTHORITY", "EVIDENCE", "APPROVAL", "RESULT", "TRACE", "REVIEW", "CHECK", "CONTROL", "EVENT", "STATE"];

export const CIPHER_FRAGMENTS = [
  "AHTR-0TY", "EV1D-3NC", "APRV-LX7", "R3V-1EW", "TRC-08F", "CH3K-19", "RSLT-X4",
  "CNTRL-7", "AX7F9", "N4RX8", "EVNT-2A", "ST4TE-B", "APRV-09", "TRC-X21",
  "RVW-77K", "CHK-A04", "AUTH-9X", "EVD-51T", "RSL-77Q", "CTL-3NX",
];

export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const GLYPHS = "ABCDEFGHKMNPRSTVWXYZ0123456789-";

export function scrambleString(seed, len = 14) {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < len; i++) {
    if (i === 4 || i === 9) { out += "-"; continue; }
    out += GLYPHS[Math.floor(rnd() * (GLYPHS.length - 1))];
  }
  return out;
}
