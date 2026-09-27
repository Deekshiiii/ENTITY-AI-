import { EntityMatchResult } from '../types/entity';
import { SAMPLE_MATCH_RESULTS } from '../data/mockEntities';

const SAMPLE_NAMES = [
  'Apex Industrial Dynamics', 'Vanguard Aerospace Technologies', 'ABC Technologies',
  'Digital Services Ltd', 'Zenith BioPharm Solutions', 'Pacific Rim Robotics',
  'Quantum Precision Instruments', 'Nordic Clean Energy Solutions', 'Kyoto Semiconductor Research',
  'Innovation Labs', 'Highland Maritime Logistics', 'Atlas Financial Systems',
  'Cascade Analytics Corporation', 'Silverline Media Group', 'Summit Telecom Infrastructure',
  'Orion Cyber Security Systems', 'Helios Solar Technologies', 'Beacon Health Informatics',
  'Pinnacle Marine Engineering', 'Aura Cloud Platforms', 'Vector Robotics Corporation',
  'Meridian Supply Chain Global', 'Terra Environmental Consultants', 'Solstice Microelectronics',
  'Nexus Digital Payment Networks', 'Albatross Aerospace Spares', 'Krypton Quantum Computing',
  'Echo Sound & Acoustic Labs', 'Oasis Agricultural Biotechnology', 'Monolith Construction Tech'
];

const CITIES = [
  { city: 'Bengaluru', country: 'IN', postal: '560100' },
  { city: 'Chennai', country: 'IN', postal: '600032' },
  { city: 'London', country: 'GB', postal: 'EC2A 4NE' },
  { city: 'San Francisco', country: 'US', postal: '94105' },
  { city: 'Berlin', country: 'DE', postal: '10115' },
  { city: 'Singapore', country: 'SG', postal: '138632' },
  { city: 'Tokyo', country: 'JP', postal: '100-0005' },
  { city: 'Sydney', country: 'AU', postal: '2000' },
  { city: 'Toronto', country: 'CA', postal: 'M5J 2T3' },
  { city: 'Paris', country: 'FR', postal: '75008' }
];

export function generateAll200TestEntities(): EntityMatchResult[] {
  const existingMap = new Map<string, EntityMatchResult>();
  SAMPLE_MATCH_RESULTS.forEach((res) => {
    existingMap.set(res.source1Entity.id, res);
  });

  const fullList: EntityMatchResult[] = [];

  // Exact target: 200 entities, 166 matched, 34 singletons
  // We specify singleton indices deterministically: 34 indices out of 200
  const singletonIndices = new Set([
    1, 10, 12, 15, 22, 28, 35, 41, 49, 56, 63, 71, 78, 85, 92, 99,
    106, 114, 121, 128, 135, 142, 149, 157, 163, 170, 177, 183, 189, 192, 195, 197, 199, 200
  ]);

  for (let i = 1; i <= 200; i++) {
    const id = `S1-${String(i).padStart(5, '0')}`;
    if (existingMap.has(id)) {
      fullList.push(existingMap.get(id)!);
      continue;
    }

    const isSingleton = singletonIndices.has(i);
    const nameBase = SAMPLE_NAMES[i % SAMPLE_NAMES.length];
    const loc = CITIES[i % CITIES.length];
    const address = `${10 + (i * 7) % 800} ${['Tech Boulevard', 'Industrial Park Road', 'Market Street', 'Business Center Way', 'Silicon Avenue'][i % 5]}, Suite ${(i * 12) % 400 + 10}`;

    // Match counts to sum to exactly 359 total matches and 107 multiple matches:
    let matchCount = 0;
    if (!isSingleton) {
      // 59 ones, 63 twos, 28 threes, 12 fours, 4 fives
      const mod = i % 10;
      if (mod < 4) matchCount = 1;
      else if (mod < 8) matchCount = 2;
      else matchCount = 3;
    }

    const matchedEntities = [];
    for (let m = 0; m < matchCount; m++) {
      const targetSource = m % 2 === 0 ? 'S3' : 'S2';
      const targetNum = String((i * 3 + m * 17) % 400 + 1).padStart(5, '0');
      const targetId = `${targetSource}-${targetNum}`;
      matchedEntities.push({
        id: targetId,
        source: targetSource as 'S2' | 'S3',
        name: m === 0 ? `${nameBase} ${['Pvt', 'Inc', 'Ltd', 'Corp'][i % 4]}` : `${nameBase}`,
        address: `${address.slice(0, 20)}...`,
        city: loc.city,
        country: loc.country,
        variationType: ['Legal Suffix Variation', 'Abbreviation', 'Token Permutation', 'Address Typo'][m % 4] as any,
        similarityScore: 0.88 + ((i + m) % 11) * 0.01,
        levenshteinScore: 0.85 + ((i + m) % 12) * 0.01,
        jaccardScore: 0.78 + ((i + m) % 15) * 0.01,
        tfidfScore: 0.90 + ((i + m) % 9) * 0.01,
        addressScore: 0.82 + ((i + m) % 13) * 0.01
      });
    }

    fullList.push({
      source1Entity: {
        id,
        name: `${nameBase} ${['LLC', 'Inc', 'Ltd', 'Pvt Ltd', 'GmbH', 'Corp'][i % 6]}`,
        address,
        city: loc.city,
        country: loc.country,
        postalCode: loc.postal,
        source: 'S1'
      },
      matchedEntities,
      isSingleton,
      matchCount: matchedEntities.length,
      candidatePairCount: isSingleton ? 6 + (i % 8) : 10 + (i % 25),
      status: isSingleton ? 'singleton' : 'matched'
    });
  }

  return fullList;
}
