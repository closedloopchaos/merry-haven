import { useState, useEffect } from 'react';

const BASE =
  'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/se/GEOCOLOR/GOES16-SE-GEOCOLOR-600x600.gif';
const REFRESH_MS = 10 * 60 * 1000;

export default function SatellitePanel() {
  const [ts, setTs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setTs(Date.now()), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <img
      src={`${BASE}?_=${ts}`}
      className="satellite-img"
      alt="GOES-16 Southeast GeoColor"
    />
  );
}
