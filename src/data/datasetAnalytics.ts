import { ValidationItem, DatasetStats } from '../types/entity';

export const DATASET_INTELLIGENCE: DatasetStats = {
  source1Count: 700, // 500 train + 200 test
  source2Count: 2400, // 1600 train + 800 test
  source3Count: 2400,
  candidatePairsTrain: 426721,
  candidatePairsTest: 83749,
  groundTruthMatches: 416,
  testPredictedMatches: 359,
  countriesCount: 42,
  missingValues: [
    { field: 'legal_entity_name', source1Missing: 0, source2Missing: 0, source3Missing: 0 },
    { field: 'street_address', source1Missing: 12, source2Missing: 84, source3Missing: 67 },
    { field: 'city_municipality', source1Missing: 5, source2Missing: 41, source3Missing: 38 },
    { field: 'iso_country_code', source1Missing: 8, source2Missing: 52, source3Missing: 49 },
    { field: 'postal_zip_code', source1Missing: 34, source2Missing: 198, source3Missing: 182 },
    { field: 'contact_phone', source1Missing: 210, source2Missing: 890, source3Missing: 795 }
  ],
  countryDistribution: [
    { country: 'United States (US)', count: 284, percentage: 40.6 },
    { country: 'India (IN)', count: 142, percentage: 20.3 },
    { country: 'United Kingdom (GB)', count: 88, percentage: 12.6 },
    { country: 'Germany (DE)', count: 62, percentage: 8.9 },
    { country: 'Canada (CA)', count: 44, percentage: 6.3 },
    { country: 'Singapore (SG)', count: 32, percentage: 4.6 },
    { country: 'Australia (AU)', count: 26, percentage: 3.7 },
    { country: 'Other 35 Countries', count: 22, percentage: 3.0 }
  ],
  nameLengthDistribution: [
    { bucket: '< 15 chars', s1: 42, s2: 184, s3: 172 },
    { bucket: '15-25 chars', s1: 290, s2: 980, s3: 1040 },
    { bucket: '26-40 chars', s1: 284, s2: 920, s3: 890 },
    { bucket: '41-60 chars', s1: 68, s2: 240, s3: 232 },
    { bucket: '> 60 chars', s1: 16, s2: 76, s3: 66 }
  ],
  addressLengthDistribution: [
    { bucket: '< 20 chars', s1: 30, s2: 190, s3: 165 },
    { bucket: '20-40 chars', s1: 240, s2: 850, s3: 890 },
    { bucket: '41-70 chars', s1: 310, s2: 960, s3: 940 },
    { bucket: '71-100 chars', s1: 95, s2: 310, s3: 315 },
    { bucket: '> 100 chars', s1: 25, s2: 90, s3: 90 }
  ]
};

export const VALIDATION_ERROR_CASES: ValidationItem[] = [
  {
    id: 'VAL-001',
    category: 'TRUE MATCH',
    source1: {
      id: 'S1-00042',
      name: 'OmniGlobal Dynamics Technologies Corp',
      address: '742 South Hill Street, Floor 14',
      country: 'US'
    },
    candidate: {
      id: 'S2-00189',
      name: 'Omni Global Dynamics Tech Corp',
      address: '742 S Hill St, Fl 14',
      country: 'US'
    },
    probability: 0.962,
    actualLabel: 1,
    predictedLabel: 1,
    features: {
      nameSimilarity: 0.94,
      addressSimilarity: 0.92,
      countrySimilarity: 1.0,
      tokenOverlap: 0.90,
      charSimilarity: 0.95,
      numericOverlap: 1.0
    },
    explanation: 'High token overlap and matching street number 742 + floor 14 confirms valid entity variant.'
  },
  {
    id: 'VAL-002',
    category: 'TRUE MATCH',
    source1: {
      id: 'S1-00088',
      name: 'Bangalore BioSciences Research Institute Ltd',
      address: 'Plot 18, Phase 2, Peenya Industrial Area',
      country: 'IN'
    },
    candidate: {
      id: 'S3-00412',
      name: 'Bangalore Bio Sciences Research Inst',
      address: '18 Peenya Indl Area Phase II',
      country: 'IN'
    },
    probability: 0.938,
    actualLabel: 1,
    predictedLabel: 1,
    features: {
      nameSimilarity: 0.91,
      addressSimilarity: 0.88,
      countrySimilarity: 1.0,
      tokenOverlap: 0.86,
      charSimilarity: 0.92,
      numericOverlap: 1.0
    },
    explanation: 'Legal suffix normalization and street address expansion bridges severe abbreviation.'
  },
  {
    id: 'VAL-003',
    category: 'TRUE NON-MATCH',
    source1: {
      id: 'S1-00115',
      name: 'Apex Precision Engineering LLC',
      address: '1200 Innovation Way',
      country: 'US'
    },
    candidate: {
      id: 'S2-00305',
      name: 'Apex Precision Castings Corp',
      address: '1450 Innovation Parkway',
      country: 'US'
    },
    probability: 0.312,
    actualLabel: 0,
    predictedLabel: 0,
    features: {
      nameSimilarity: 0.62,
      addressSimilarity: 0.44,
      countrySimilarity: 1.0,
      tokenOverlap: 0.50,
      charSimilarity: 0.68,
      numericOverlap: 0.0
    },
    explanation: 'Shared common tokens ("Apex Precision") were correctly rejected due to divergent business root ("Castings" vs "Engineering") and differing street numbers.'
  },
  {
    id: 'VAL-004',
    category: 'TRUE NON-MATCH',
    source1: {
      id: 'S1-00192',
      name: 'Starlight Media Solutions Inc',
      address: '88 King Street West, Suite 210',
      country: 'CA'
    },
    candidate: {
      id: 'S3-00620',
      name: 'Starlight Financial Consulting',
      address: '88 Queen Street West',
      country: 'CA'
    },
    probability: 0.245,
    actualLabel: 0,
    predictedLabel: 0,
    features: {
      nameSimilarity: 0.48,
      addressSimilarity: 0.52,
      countrySimilarity: 1.0,
      tokenOverlap: 0.33,
      charSimilarity: 0.55,
      numericOverlap: 1.0
    },
    explanation: 'Common city block ("88 Street West") isolated; model avoided false merge due to distinct business domain keywords.'
  },
  {
    id: 'VAL-005',
    category: 'FALSE MATCH',
    source1: {
      id: 'S1-00214',
      name: 'National Logistics Hub East LLC',
      address: '500 Gateway Terminal Road',
      country: 'US'
    },
    candidate: {
      id: 'S2-00540',
      name: 'National Logistics Hub West LLC',
      address: '500 Gateway Terminal Road',
      country: 'US'
    },
    probability: 0.612,
    actualLabel: 0,
    predictedLabel: 1,
    features: {
      nameSimilarity: 0.88,
      addressSimilarity: 1.0,
      countrySimilarity: 1.0,
      tokenOverlap: 0.83,
      charSimilarity: 0.92,
      numericOverlap: 1.0
    },
    explanation: 'Hard edge case: shared co-location terminal address with directional keyword difference ("East" vs "West"). Preventable with elevated directional penalty.'
  },
  {
    id: 'VAL-006',
    category: 'MISSED MATCH',
    source1: {
      id: 'S1-00305',
      name: 'The International Maritime Forwarding Company Ltd',
      address: 'Harbor Gate 4, Quay 12',
      country: 'GB'
    },
    candidate: {
      id: 'S3-00789',
      name: 'Intl Mar Fwd Co',
      address: 'Hbr Gate 4',
      country: 'GB'
    },
    probability: 0.468,
    actualLabel: 1,
    predictedLabel: 0,
    features: {
      nameSimilarity: 0.42,
      addressSimilarity: 0.56,
      countrySimilarity: 1.0,
      tokenOverlap: 0.25,
      charSimilarity: 0.48,
      numericOverlap: 1.0
    },
    explanation: 'Extreme quadruple contraction: every single word token was aggressively shortened. Scored 0.468, falling just below the 0.50 threshold.'
  }
];
