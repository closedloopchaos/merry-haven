// Canonical ascent / recovery timelines by rocket family.
// Times in seconds since liftoff (T+0). Values are NOMINAL — actual launches vary by mission.

export const TIMELINES = {
  falcon9: {
    family: 'FALCON 9',
    duration: 600, // 10 min — covers through SECO-1, payload deploy timings vary widely
    milestones: [
      { t: 0,    name: 'LIFTOFF',  note: 'pad clear' },
      { t: 72,   name: 'MAX-Q',    note: 'max dynamic pressure' },
      { t: 150,  name: 'MECO',     note: 'first stage cutoff' },
      { t: 153,  name: 'SEP',      note: 'stage separation' },
      { t: 158,  name: 'SES-1',    note: 'second stage ignites' },
      { t: 220,  name: 'FAIRING',  note: 'fairing jettison' },
      { t: 395,  name: 'ENTRY',    note: 'booster entry burn' },
      { t: 495,  name: 'LANDING',  note: 'booster touchdown' },
      { t: 540,  name: 'SECO-1',   note: 'orbit insertion' },
    ],
  },

  falconHeavy: {
    family: 'FALCON HEAVY',
    duration: 600,
    milestones: [
      { t: 0,   name: 'LIFTOFF',  note: 'all 27 engines' },
      { t: 66,  name: 'MAX-Q',    note: 'max dynamic pressure' },
      { t: 150, name: 'BECO',     note: 'side boosters cutoff' },
      { t: 153, name: 'BSEP',     note: 'side boosters separate' },
      { t: 175, name: 'MECO',     note: 'core stage cutoff' },
      { t: 178, name: 'SEP',      note: 'core stage separates' },
      { t: 183, name: 'SES-1',    note: 'second stage ignites' },
      { t: 475, name: 'SIDE LZ',  note: 'side boosters LZ-1/2' },
      { t: 499, name: 'CORE',     note: 'core lands ASDS' },
      { t: 510, name: 'SECO-1',   note: 'orbit insertion' },
    ],
  },

  atlasV: {
    family: 'ATLAS V',
    duration: 1200, // 20 min — typical Centaur LEO/GTO ascent
    milestones: [
      { t: 0,    name: 'LIFTOFF',  note: 'RD-180 ignition' },
      { t: 78,   name: 'MAX-Q',    note: 'max dynamic pressure' },
      { t: 110,  name: 'SRB JETT', note: 'solid boosters drop' },
      { t: 245,  name: 'BECO',     note: 'booster engine cutoff' },
      { t: 250,  name: 'BSEP',     note: 'stage separation' },
      { t: 264,  name: 'CSO-1',    note: 'Centaur ignition 1' },
      { t: 268,  name: 'FAIRING',  note: 'payload fairing drop' },
      { t: 1090, name: 'CSO-2',    note: 'Centaur restart' },
      { t: 1145, name: 'DEPLOY',   note: 'spacecraft separation' },
    ],
  },

  vulcan: {
    family: 'VULCAN CENTAUR',
    duration: 900,
    milestones: [
      { t: 0,   name: 'LIFTOFF',  note: 'BE-4 + solids' },
      { t: 78,  name: 'MAX-Q',    note: 'max dynamic pressure' },
      { t: 110, name: 'SRB JETT', note: 'solids drop' },
      { t: 305, name: 'BECO',     note: 'core cutoff' },
      { t: 310, name: 'SEP',      note: 'stage separation' },
      { t: 320, name: 'CENTAUR',  note: 'Centaur V ignition' },
      { t: 340, name: 'FAIRING',  note: 'fairing jettison' },
      { t: 850, name: 'DEPLOY',   note: 'spacecraft separation' },
    ],
  },

  starship: {
    family: 'STARSHIP',
    duration: 4500, // 75 min through ship landing
    milestones: [
      { t: 0,    name: 'LIFTOFF',   note: '33 Raptor engines' },
      { t: 78,   name: 'MAX-Q',     note: 'max dynamic pressure' },
      { t: 160,  name: 'HOT STAGE', note: 'hot-staging + SH boostback' },
      { t: 420,  name: 'SH CATCH',  note: 'Super Heavy returns' },
      { t: 480,  name: 'SECO',      note: 'Ship orbit insertion' },
      { t: 2700, name: 'REENTRY',   note: 'Ship reentry begins' },
      { t: 3900, name: 'FLIP',      note: 'belly flop maneuver' },
      { t: 4200, name: 'LANDING',   note: 'Ship landing burn' },
    ],
  },

  electron: {
    family: 'ELECTRON',
    duration: 540,
    milestones: [
      { t: 0,   name: 'LIFTOFF',  note: '9 Rutherford engines' },
      { t: 70,  name: 'MAX-Q',    note: 'max dynamic pressure' },
      { t: 152, name: 'BECO',     note: 'first stage cutoff' },
      { t: 155, name: 'SEP',      note: 'stage separation' },
      { t: 162, name: 'SES-1',    note: 'second stage ignites' },
      { t: 195, name: 'FAIRING',  note: 'fairing jettison' },
      { t: 555, name: 'SECO',     note: 'orbit insertion' },
    ],
  },

  newGlenn: {
    family: 'NEW GLENN',
    duration: 900,
    milestones: [
      { t: 0,   name: 'LIFTOFF',  note: '7 BE-4 engines' },
      { t: 80,  name: 'MAX-Q',    note: 'max dynamic pressure' },
      { t: 195, name: 'MECO',     note: 'first stage cutoff' },
      { t: 200, name: 'SEP',      note: 'stage separation' },
      { t: 220, name: 'SES-1',    note: 'BE-3U upper ignites' },
      { t: 540, name: 'LANDING',  note: 'first stage on Jacklyn' },
      { t: 700, name: 'SECO',     note: 'orbit insertion' },
    ],
  },

  generic: {
    family: 'NOMINAL ASCENT',
    duration: 900,
    milestones: [
      { t: 0,   name: 'LIFTOFF', note: 'pad clear' },
      { t: 75,  name: 'MAX-Q',   note: 'max dynamic pressure' },
      { t: 180, name: 'STAGING', note: 'stage separation' },
      { t: 540, name: 'ORBIT',   note: 'orbit insertion' },
      { t: 800, name: 'DEPLOY',  note: 'spacecraft separation' },
    ],
  },
};

export function detectFamily(launch) {
  const name = (
    launch?.rocket?.configuration?.name ??
    launch?.rocket?.configuration?.full_name ??
    ''
  ).toLowerCase();
  if (name.includes('falcon heavy')) return 'falconHeavy';
  if (name.includes('falcon 9'))     return 'falcon9';
  if (name.includes('starship'))     return 'starship';
  if (name.includes('atlas v'))      return 'atlasV';
  if (name.includes('atlas'))        return 'atlasV';
  if (name.includes('vulcan'))       return 'vulcan';
  if (name.includes('electron'))     return 'electron';
  if (name.includes('new glenn'))    return 'newGlenn';
  return null;
}

export function getTimeline(launch) {
  const family = detectFamily(launch);
  if (family && TIMELINES[family]) return TIMELINES[family];
  return TIMELINES.generic;
}
