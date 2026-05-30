// Site definitions for multi-range support.
//
// `coords` is [lon, lat].
// `pads` use 0–100 SVG space, x measured left→right, y measured top→bottom.
// `matchTerms` are lowercase substrings tested against pad name + location.

export const SITES = {
  spacecoast: {
    id: 'spacecoast',
    label: 'SPACE COAST',
    coords: [-80.604, 28.608],
    nwsStation: 'KXMR',
    streamId: 'spacecoast',
    radarLat: 28.39,
    radarLon: -80.61,
    radarZoom: 7,
    matchTerms: [
      'kennedy', 'cape canaveral', 'cape c', 'ksc', 'ccsfs',
      'sld-45', 'space coast', 'lc-39', 'slc-40', 'slc-41', 'slc-37', 'lc-36', 'slc-46',
    ],
    // Florida coast — KSC north, CCSFS south
    pads: [
      { id: 'LC-39B',  short: '39B', match: ['39b', 'la-39b', 'lc-39b'],                              x: 30, y: 12, site: 'KSC' },
      { id: 'LC-39A',  short: '39A', match: ['39a', 'la-39a', 'lc-39a'],                              x: 32, y: 22, site: 'KSC' },
      { id: 'SLC-40',  short: '40',  match: ['slc-40', 'space launch complex 40', 'lc-40'],           x: 38, y: 42, site: 'CCSFS' },
      { id: 'SLC-41',  short: '41',  match: ['slc-41', 'space launch complex 41', 'lc-41'],           x: 41, y: 54, site: 'CCSFS' },
      { id: 'SLC-37',  short: '37',  match: ['slc-37', 'lc-37'],                                       x: 42, y: 68, site: 'CCSFS' },
      { id: 'LC-36',   short: '36',  match: ['lc-36', 'launch complex 36'],                            x: 43, y: 78, site: 'CCSFS' },
      { id: 'SLC-46',  short: '46',  match: ['slc-46', 'lc-46'],                                       x: 46, y: 88, site: 'CCSFS' },
    ],
    siteLabels: [
      { text: 'KSC',   x: 2, y: 6  },
      { text: 'CCSFS', x: 2, y: 38 },
    ],
    coastline: { x: 60 }, // vertical line marking the Atlantic
  },

  starbase: {
    id: 'starbase',
    label: 'STARBASE',
    coords: [-97.156, 25.997],
    nwsStation: 'KBRO',
    streamId: 'starbase',
    radarLat: 25.99,
    radarLon: -97.16,
    radarZoom: 9,
    matchTerms: [
      'boca chica', 'starbase', 'olp-1', 'olp-2', 'orbital launch pad',
    ],
    // Boca Chica — Gulf coast, pads on a north-south line near the beach
    pads: [
      { id: 'OLP-1', short: 'OLP-1', match: ['olp-1', 'orbital launch pad a', 'olp a'], x: 38, y: 50, site: 'Starbase' },
      { id: 'OLP-2', short: 'OLP-2', match: ['olp-2', 'orbital launch pad b', 'olp b'], x: 38, y: 60, site: 'Starbase' },
    ],
    siteLabels: [
      { text: 'STARBASE', x: 2, y: 46 },
    ],
    coastline: { x: 58 }, // Gulf shoreline
  },

  vandenberg: {
    id: 'vandenberg',
    label: 'VANDENBERG',
    coords: [-120.572, 34.742],
    nwsStation: 'KVBG',
    streamId: null, // no dedicated VBG webcast — falls back to default
    radarLat: 34.74,
    radarLon: -120.57,
    radarZoom: 8,
    matchTerms: [
      'vandenberg', 'vsfb', 'vafb', 'slc-3', 'slc-4', 'slc-6', 'slc-8',
    ],
    // Vandenberg — California coast, pads strung north-south along the SLC line
    pads: [
      { id: 'SLC-6',  short: '6',   match: ['slc-6', 'lc-6'],                              x: 42, y: 16, site: 'SOUTH' },
      { id: 'SLC-4W', short: '4W',  match: ['slc-4w', 'lc-4w'],                            x: 40, y: 36, site: 'SOUTH' },
      { id: 'SLC-4E', short: '4E',  match: ['slc-4e', 'lc-4e', 'space launch complex 4'], x: 40, y: 44, site: 'SOUTH' },
      { id: 'SLC-3E', short: '3E',  match: ['slc-3e', 'space launch complex 3'],          x: 38, y: 62, site: 'NORTH' },
      { id: 'SLC-2W', short: '2W',  match: ['slc-2w'],                                     x: 36, y: 78, site: 'NORTH' },
    ],
    siteLabels: [
      { text: 'VANDENBERG SFB', x: 2, y: 8 },
    ],
    coastline: { x: 52 }, // Pacific shoreline
  },
};

const FALLBACK_SITE_ID = 'spacecoast';

// Determine which site a launch belongs to by matching pad/location text.
// Returns a site id string. Defaults to spacecoast if no match.
export function getSiteForLaunch(launch) {
  if (!launch) return FALLBACK_SITE_ID;
  const text = `${launch.pad?.location?.name ?? ''} ${launch.pad?.name ?? ''}`.toLowerCase();
  if (!text.trim()) return FALLBACK_SITE_ID;
  for (const site of Object.values(SITES)) {
    if (site.matchTerms.some(t => text.includes(t))) return site.id;
  }
  return FALLBACK_SITE_ID;
}

export function getSite(id) {
  return SITES[id] ?? SITES[FALLBACK_SITE_ID];
}

export const SITE_ORDER = ['spacecoast', 'starbase', 'vandenberg'];
