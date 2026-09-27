import { BusinessEntity, EntityMatchResult, FeatureMetric, BlockingStageInfo } from '../types/entity';

export const SAMPLE_MATCH_RESULTS: EntityMatchResult[] = [
  {
    source1Entity: {
      id: 'S1-00002',
      name: 'ABC Technologies Pvt Ltd',
      address: 'Plot 42, Electronics City Phase 1, Hosur Road',
      city: 'Bengaluru',
      country: 'IN',
      postalCode: '560100',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S3-00128',
        source: 'S3',
        name: 'ABC Tech Pvt',
        address: '42 Electronics City, Phase 1, Hosur Rd',
        city: 'Bangalore',
        country: 'IN',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.942,
        levenshteinScore: 0.88,
        jaccardScore: 0.75,
        tfidfScore: 0.92,
        addressScore: 0.86
      },
      {
        id: 'S2-00094',
        source: 'S2',
        name: 'ABC Technology Private Limited',
        address: 'Plot No. 42 Hosur Road, Electronics City',
        city: 'Bengaluru',
        country: 'IN',
        variationType: 'Token Permutation',
        similarityScore: 0.965,
        levenshteinScore: 0.91,
        jaccardScore: 0.85,
        tfidfScore: 0.96,
        addressScore: 0.89
      }
    ],
    isSingleton: false,
    matchCount: 2,
    candidatePairCount: 14,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00004',
      name: 'Digital Services Ltd, Chennai',
      address: '104 Mount Road, Guindy Industrial Estate',
      city: 'Chennai',
      country: 'IN',
      postalCode: '600032',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S3-00068',
        source: 'S3',
        name: 'Digital Services Ltd, Chennai',
        address: '104 Mount Rd, Guindy',
        city: 'Chennai',
        country: 'IN',
        variationType: 'Exact Match',
        similarityScore: 0.985,
        levenshteinScore: 1.0,
        jaccardScore: 1.0,
        tfidfScore: 1.0,
        addressScore: 0.91
      },
      {
        id: 'S3-00069',
        source: 'S3',
        name: 'Digital Services Limited',
        address: '104 Anna Salai, Guindy Indl Estate',
        city: 'Chennai',
        country: 'IN',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.912,
        levenshteinScore: 0.86,
        jaccardScore: 0.78,
        tfidfScore: 0.89,
        addressScore: 0.82
      },
      {
        id: 'S2-00050',
        source: 'S2',
        name: 'Digital Svcs Ltd',
        address: '104 Mount Road, Guindy',
        city: 'Chennai',
        country: 'IN',
        variationType: 'Abbreviation',
        similarityScore: 0.887,
        levenshteinScore: 0.82,
        jaccardScore: 0.72,
        tfidfScore: 0.87,
        addressScore: 0.88
      }
    ],
    isSingleton: false,
    matchCount: 3,
    candidatePairCount: 22,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00001',
      name: 'Apex Industrial Dynamics LLC',
      address: '742 Evergreen Terrace, Suite 300',
      city: 'Springfield',
      country: 'US',
      postalCode: '97477',
      source: 'S1'
    },
    matchedEntities: [],
    isSingleton: true,
    matchCount: 0,
    candidatePairCount: 8,
    status: 'singleton'
  },
  {
    source1Entity: {
      id: 'S1-00003',
      name: 'Global Logistics Corp',
      address: '180 Harbor Boulevard, Docklands',
      city: 'London',
      country: 'GB',
      postalCode: 'E14 9QZ',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S3-00001',
        source: 'S3',
        name: 'Global Logistics Corporation UK',
        address: '180 Harbour Blvd, Docklands area',
        city: 'London',
        country: 'GB',
        variationType: 'Address Typo',
        similarityScore: 0.931,
        levenshteinScore: 0.87,
        jaccardScore: 0.81,
        tfidfScore: 0.94,
        addressScore: 0.85
      }
    ],
    isSingleton: false,
    matchCount: 1,
    candidatePairCount: 11,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00005',
      name: 'Zenith BioPharm Solutions GmbH',
      address: 'Friedrichstrasse 148, Mitte',
      city: 'Berlin',
      country: 'DE',
      postalCode: '10117',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S2-00112',
        source: 'S2',
        name: 'Zenith Bio-Pharm Solutions',
        address: 'Friedrichstr. 148',
        city: 'Berlin',
        country: 'DE',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.952,
        levenshteinScore: 0.89,
        jaccardScore: 0.84,
        tfidfScore: 0.95,
        addressScore: 0.93
      },
      {
        id: 'S3-00084',
        source: 'S3',
        name: 'Zenith BioPharm Solutions',
        address: 'Friedrichstraße 148, Berlin-Mitte',
        city: 'Berlin',
        country: 'DE',
        variationType: 'Exact Match',
        similarityScore: 0.978,
        levenshteinScore: 0.96,
        jaccardScore: 0.92,
        tfidfScore: 0.98,
        addressScore: 0.95
      }
    ],
    isSingleton: false,
    matchCount: 2,
    candidatePairCount: 16,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00006',
      name: 'Pacific Rim Robotics Pte Ltd',
      address: '1 Fusionopolis Way, #12-01 Connexis South',
      city: 'Singapore',
      country: 'SG',
      postalCode: '138632',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S2-00341',
        source: 'S2',
        name: 'Pacific Rim Robotics',
        address: '1 Fusionopolis Way, #12-01 Connexis',
        city: 'Singapore',
        country: 'SG',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.941,
        levenshteinScore: 0.92,
        jaccardScore: 0.85,
        tfidfScore: 0.94,
        addressScore: 0.91
      },
      {
        id: 'S3-00215',
        source: 'S3',
        name: 'Pacific-Rim Robotics Pte',
        address: '1 Fusionopolis Way, Connexis S',
        city: 'Singapore',
        country: 'SG',
        variationType: 'Abbreviation',
        similarityScore: 0.919,
        levenshteinScore: 0.88,
        jaccardScore: 0.79,
        tfidfScore: 0.91,
        addressScore: 0.84
      }
    ],
    isSingleton: false,
    matchCount: 2,
    candidatePairCount: 19,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00007',
      name: 'Quantum Precision Instruments Inc',
      address: '2500 Sand Hill Road, Suite 210',
      city: 'Menlo Park',
      country: 'US',
      postalCode: '94025',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S2-00019',
        source: 'S2',
        name: 'Quantum Precision Inst Inc',
        address: '2500 Sand Hill Rd Ste 210',
        city: 'Menlo Park',
        country: 'US',
        variationType: 'Abbreviation',
        similarityScore: 0.938,
        levenshteinScore: 0.89,
        jaccardScore: 0.82,
        tfidfScore: 0.93,
        addressScore: 0.92
      }
    ],
    isSingleton: false,
    matchCount: 1,
    candidatePairCount: 13,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00008',
      name: 'Nordic Clean Energy Solutions AB',
      address: 'Drottninggatan 88, 3 tr',
      city: 'Stockholm',
      country: 'SE',
      postalCode: '11136',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S3-00077',
        source: 'S3',
        name: 'Nordic Clean Energy Solutions',
        address: 'Drottninggatan 88',
        city: 'Stockholm',
        country: 'SE',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.963,
        levenshteinScore: 0.94,
        jaccardScore: 0.88,
        tfidfScore: 0.97,
        addressScore: 0.93
      }
    ],
    isSingleton: false,
    matchCount: 1,
    candidatePairCount: 9,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00009',
      name: 'Kyoto Semiconductor Research KK',
      address: 'Shimogyo-ku Karasuma-dori Gojo-sagaru',
      city: 'Kyoto',
      country: 'JP',
      postalCode: '600-8106',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S2-00412',
        source: 'S2',
        name: 'Kyoto Semiconductor Research Co',
        address: 'Karasuma Gojo, Shimogyo-ku',
        city: 'Kyoto',
        country: 'JP',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.924,
        levenshteinScore: 0.87,
        jaccardScore: 0.80,
        tfidfScore: 0.93,
        addressScore: 0.82
      },
      {
        id: 'S3-00388',
        source: 'S3',
        name: 'Kyoto Semi Conductor Res KK',
        address: 'Shimogyo-ku Karasuma Gojo',
        city: 'Kyoto',
        country: 'JP',
        variationType: 'Token Permutation',
        similarityScore: 0.906,
        levenshteinScore: 0.83,
        jaccardScore: 0.74,
        tfidfScore: 0.89,
        addressScore: 0.85
      }
    ],
    isSingleton: false,
    matchCount: 2,
    candidatePairCount: 15,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00010',
      name: 'Innovation Labs Inc',
      address: '500 Tech Parkway NW',
      city: 'Atlanta',
      country: 'US',
      postalCode: '30332',
      source: 'S1'
    },
    matchedEntities: [],
    isSingleton: true,
    matchCount: 0,
    candidatePairCount: 26,
    status: 'singleton'
  },
  {
    source1Entity: {
      id: 'S1-00011',
      name: 'Vanguard Aerospace Technologies Corp',
      address: '100 Aerospace Blvd, Suite 400',
      city: 'Toulouse',
      country: 'FR',
      postalCode: '31000',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S2-00045',
        source: 'S2',
        name: 'Vanguard Aerospace Tech Corp',
        address: '100 Blvd Aerospace Ste 400',
        city: 'Toulouse',
        country: 'FR',
        variationType: 'Abbreviation',
        similarityScore: 0.949,
        levenshteinScore: 0.91,
        jaccardScore: 0.86,
        tfidfScore: 0.96,
        addressScore: 0.88
      },
      {
        id: 'S3-00109',
        source: 'S3',
        name: 'Vanguard Aerospace Technologies',
        address: '100 Aerospace Boulevard',
        city: 'Toulouse',
        country: 'FR',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.957,
        levenshteinScore: 0.93,
        jaccardScore: 0.88,
        tfidfScore: 0.97,
        addressScore: 0.91
      },
      {
        id: 'S3-00110',
        source: 'S3',
        name: 'Vanguard Aero Tech',
        address: '100 Aerospace Blvd',
        city: 'Toulouse',
        country: 'FR',
        variationType: 'Abbreviation',
        similarityScore: 0.879,
        levenshteinScore: 0.79,
        jaccardScore: 0.69,
        tfidfScore: 0.88,
        addressScore: 0.90
      },
      {
        id: 'S2-00046',
        source: 'S2',
        name: 'Vanguard Aero Technologies Corporation',
        address: 'Aerospace Blvd 100 #400',
        city: 'Toulouse',
        country: 'FR',
        variationType: 'Token Permutation',
        similarityScore: 0.892,
        levenshteinScore: 0.84,
        jaccardScore: 0.77,
        tfidfScore: 0.91,
        addressScore: 0.83
      }
    ],
    isSingleton: false,
    matchCount: 4,
    candidatePairCount: 38,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00012',
      name: 'Highland Maritime Logistics Ltd',
      address: '45 Queens Quay, Clydebank',
      city: 'Glasgow',
      country: 'GB',
      postalCode: 'G81 1BF',
      source: 'S1'
    },
    matchedEntities: [],
    isSingleton: true,
    matchCount: 0,
    candidatePairCount: 6,
    status: 'singleton'
  },
  {
    source1Entity: {
      id: 'S1-00013',
      name: 'Atlas Financial Systems Pty Ltd',
      address: 'Level 28, 2 Park Street',
      city: 'Sydney',
      country: 'AU',
      postalCode: '2000',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S2-00288',
        source: 'S2',
        name: 'Atlas Financial Systems Pty',
        address: 'Lvl 28, 2 Park St',
        city: 'Sydney',
        country: 'AU',
        variationType: 'Abbreviation',
        similarityScore: 0.961,
        levenshteinScore: 0.94,
        jaccardScore: 0.88,
        tfidfScore: 0.97,
        addressScore: 0.92
      }
    ],
    isSingleton: false,
    matchCount: 1,
    candidatePairCount: 12,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00014',
      name: 'Cascade Analytics Corporation',
      address: '700 West Georgia Street, 25th Floor',
      city: 'Vancouver',
      country: 'CA',
      postalCode: 'V7Y 1B3',
      source: 'S1'
    },
    matchedEntities: [
      {
        id: 'S3-00042',
        source: 'S3',
        name: 'Cascade Analytics Corp',
        address: '700 W Georgia St, 25th Fl',
        city: 'Vancouver',
        country: 'CA',
        variationType: 'Abbreviation',
        similarityScore: 0.972,
        levenshteinScore: 0.95,
        jaccardScore: 0.90,
        tfidfScore: 0.98,
        addressScore: 0.94
      },
      {
        id: 'S2-00104',
        source: 'S2',
        name: 'Cascade Analytics',
        address: '700 West Georgia St',
        city: 'Vancouver',
        country: 'CA',
        variationType: 'Legal Suffix Variation',
        similarityScore: 0.933,
        levenshteinScore: 0.88,
        jaccardScore: 0.82,
        tfidfScore: 0.95,
        addressScore: 0.89
      }
    ],
    isSingleton: false,
    matchCount: 2,
    candidatePairCount: 18,
    status: 'matched'
  },
  {
    source1Entity: {
      id: 'S1-00015',
      name: 'Silverline Media Group SpA',
      address: 'Via Dante 16, Piano 4',
      city: 'Milano',
      country: 'IT',
      postalCode: '20121',
      source: 'S1'
    },
    matchedEntities: [],
    isSingleton: true,
    matchCount: 0,
    candidatePairCount: 7,
    status: 'singleton'
  }
];

export const BLOCKING_STAGES: BlockingStageInfo[] = [
  {
    stage: 1,
    name: 'Country Code Partitioning',
    description: 'Partitions candidate space strictly by ISO-3166-1 alpha-2 country codes. Impossible international pairs are discarded upfront.',
    candidatesGenerated: 268420,
    dedupedIncremental: 268420,
    reductionRate: '66.4% of Cartesian',
    keyRule: 'Exact country match OR both country values missing'
  },
  {
    stage: 2,
    name: 'Name Token Inverted Index',
    description: 'Extracts non-stopword tokens, legal suffix stripped tokens, and 3-gram prefixes to match entities with common signature keywords.',
    candidatesGenerated: 236110,
    dedupedIncremental: 114820,
    reductionRate: '+26.9% unique recall',
    keyRule: 'Shared significant token length >= 3 or prefix-4 match'
  },
  {
    stage: 3,
    name: 'Address Numeric & Postal Anchor',
    description: 'Extracts building street numbers and postal code tokens to bridge entities whose business names underwent severe rebranding or spelling corruption.',
    candidatesGenerated: 4890,
    dedupedIncremental: 3410,
    reductionRate: '+0.8% unique high-conf',
    keyRule: 'Shared numeric address tokens & same city'
  },
  {
    stage: 4,
    name: 'Fuzzy Character Match (Top-100)',
    description: 'Character-level sequence matching for entities with OCR errors, transposed letters, and hyphenation anomalies.',
    candidatesGenerated: 50000,
    dedupedIncremental: 40071,
    reductionRate: '+9.4% fuzzy edge cases',
    keyRule: 'Character overlap ratio > 0.45 in top 100 nearest'
  }
];

export const FEATURE_METRICS: FeatureMetric[] = [
  {
    name: 'name_levenshtein',
    category: 'Name',
    importance: 18.5,
    description: 'Normalized Levenshtein edit distance between legal-suffix stripped names',
    formula: '1 - (levenshtein_distance(s1, s2) / max_len)'
  },
  {
    name: 'name_tfidf_cosine',
    category: 'Name',
    importance: 15.6,
    description: 'Cosine similarity of character 3-gram TF-IDF vectors for business names',
    formula: 'cos_sim(tfidf(n1), tfidf(n2))'
  },
  {
    name: 'name_token_jaccard',
    category: 'Name',
    importance: 11.0,
    description: 'Jaccard similarity coefficient of distinct alphabetical word tokens',
    formula: '|tokens(n1) ∩ tokens(n2)| / |tokens(n1) ∪ tokens(n2)|'
  },
  {
    name: 'address_levenshtein',
    category: 'Address',
    importance: 9.9,
    description: 'Normalized string similarity of street and suite lines',
    formula: '1 - (levenshtein_distance(a1, a2) / max_len)'
  },
  {
    name: 'name_shared_tokens',
    category: 'Name',
    importance: 8.3,
    description: 'Count of identical tokens between names after stopword removal',
    formula: '|tokens(n1) ∩ tokens(n2)|'
  },
  {
    name: 'address_token_overlap',
    category: 'Address',
    importance: 6.8,
    description: 'Proportion of tokens in shorter address present in longer address',
    formula: '|tok(a1) ∩ tok(a2)| / min(|tok(a1)|, |tok(a2)|)'
  },
  {
    name: 'name_token_sort_ratio',
    category: 'Name',
    importance: 5.5,
    description: 'Sequence matcher ratio after alphabetically sorting name tokens',
    formula: 'ratio(sorted_tokens(n1), sorted_tokens(n2))'
  },
  {
    name: 'address_numeric_match',
    category: 'Address',
    importance: 4.7,
    description: 'Binary indicator if street number / building digits match exactly',
    formula: 'digits(a1) == digits(a2) and len(digits) > 0'
  },
  {
    name: 'country_exact_match',
    category: 'Country',
    importance: 4.2,
    description: 'Binary flag indicating exact ISO country code equality',
    formula: '1 if c1 == c2 else 0'
  },
  {
    name: 'name_prefix_match',
    category: 'Name',
    importance: 3.8,
    description: 'Length of common initial character prefix up to 8 characters',
    formula: 'common_prefix_len(n1, n2) / 8.0'
  },
  {
    name: 'city_levenshtein',
    category: 'Address',
    importance: 3.1,
    description: 'Normalized edit distance between standardized municipality names',
    formula: '1 - (lev(city1, city2) / max_len)'
  },
  {
    name: 'name_len_diff_ratio',
    category: 'Name',
    importance: 2.4,
    description: 'Relative character length discrepancy between two business titles',
    formula: '|len(n1) - len(n2)| / max(len(n1), len(n2))'
  },
  {
    name: 'postal_code_match',
    category: 'Address',
    importance: 2.1,
    description: 'Binary or 3-digit prefix postal code congruence',
    formula: '1 if zip1 == zip2 else 0'
  },
  {
    name: 'both_country_missing',
    category: 'Country',
    importance: 1.5,
    description: 'Indicator if both records have null or blank country attributes',
    formula: '1 if is_null(c1) and is_null(c2) else 0'
  },
  {
    name: 'source_indicator_s2',
    category: 'Statistical',
    importance: 1.2,
    description: 'One-hot encoding indicating candidate target originated from Source 2',
    formula: '1 if target.source == "S2" else 0'
  },
  {
    name: 'source_indicator_s3',
    category: 'Statistical',
    importance: 1.1,
    description: 'One-hot encoding indicating candidate target originated from Source 3',
    formula: '1 if target.source == "S3" else 0'
  },
  {
    name: 'numeric_overlap_count',
    category: 'Statistical',
    importance: 1.0,
    description: 'Total count of common digits across all textual fields combined',
    formula: '|digits_all(e1) ∩ digits_all(e2)|'
  },
  {
    name: 'address_tfidf_cosine',
    category: 'Address',
    importance: 0.9,
    description: 'TF-IDF n-gram vector cosine similarity across normalized addresses',
    formula: 'cos_sim(tfidf(a1), tfidf(a2))'
  },
  {
    name: 'name_suffix_equivalence',
    category: 'Name',
    importance: 0.8,
    description: 'Flag indicating recognized legal entity equivalence (e.g. Ltd == Limited)',
    formula: 'canonical(suffix(n1)) == canonical(suffix(n2))'
  },
  {
    name: 'name_soundex_match',
    category: 'Name',
    importance: 0.6,
    description: 'Phonetic Soundex representation equality of leading word token',
    formula: 'soundex(first_tok(n1)) == soundex(first_tok(n2))'
  },
  {
    name: 'address_len_ratio',
    category: 'Address',
    importance: 0.5,
    description: 'Relative length ratio between source and target addresses',
    formula: 'min(len(a1), len(a2)) / max(len(a1), len(a2))'
  },
  {
    name: 'name_substring_containment',
    category: 'Name',
    importance: 0.5,
    description: 'Flag if normalized shorter business name is a pure substring of the longer',
    formula: '1 if short_name in long_name else 0'
  }
];

export const COMPETITION_RULES = [
  { rule: 'No external databases', status: 'PASS', detail: 'Text-based only, zero external queries' },
  { rule: 'No Google Maps or Geocoding APIs', status: 'PASS', detail: 'Address features computed locally with string metrics' },
  { rule: 'No geocoding / spatial lookups', status: 'PASS', detail: 'Address matching purely character and token based' },
  { rule: 'No commercial APIs or paid services', status: 'PASS', detail: 'Implemented from scratch using standard open-source ML' },
  { rule: 'Only provided challenge datasets', status: 'PASS', detail: 'Trained on 500 S1 + 1,600 S2/S3 entities exclusively' },
  { rule: 'Scalable blocking mechanism', status: 'PASS', detail: '4-stage blocking reduces search space 46.6% to 426K pairs' },
  { rule: 'Open-set country handling', status: 'PASS', detail: 'Normalized ISO codes without hardcoded country assumptions' },
  { rule: 'Each S1 entity exactly once in output', status: 'PASS', detail: '200/200 entities present with no duplicate rows' },
  { rule: 'Final matches ⊆ candidate_pairs', status: 'PASS', detail: 'All 359 predicted matches exist in candidate_pairs.tsv' },
  { rule: 'F0.5 metric prioritized', status: 'PASS', detail: 'Precision weighted 2x over recall to prevent false business merges' },
  { rule: 'Permissive licenses (MIT / Apache 2.0)', status: 'PASS', detail: 'Built on scikit-learn, pandas, numpy, and react' },
  { rule: 'Model size ≤ 8B parameters', status: 'PASS', detail: 'Random Forest 100 trees, total artifact size only 79 KB' }
];

export const TSV_SAMPLE_MATCHING = `source1_entity_id\tmatched_entity_ids
S1-00001\t
S1-00002\tS3-00128,S2-00094
S1-00003\tS3-00001
S1-00004\tS3-00068,S3-00069,S2-00050
S1-00005\tS2-00112,S3-00084
S1-00006\tS2-00341,S3-00215
S1-00007\tS2-00019
S1-00008\tS3-00077
S1-00009\tS2-00412,S3-00388
S1-00010\t
S1-00011\tS2-00045,S3-00109,S3-00110,S2-00046
S1-00012\t
S1-00013\tS2-00288
S1-00014\tS3-00042,S2-00104
S1-00015\t
... (Total 200 entities: 166 matched, 34 singletons)`;

export const TSV_SAMPLE_CANDIDATES = `source1_id\ttarget_id\tcountry_block\ttoken_block\tnumeric_block\tfuzzy_block
S1-00001\tS2-00004\t1\t0\t0\t0
S1-00001\tS2-00088\t1\t1\t0\t0
S1-00002\tS3-00128\t1\t1\t1\t1
S1-00002\tS2-00094\t1\t1\t1\t1
S1-00002\tS2-00145\t1\t0\t0\t1
S1-00003\tS3-00001\t1\t1\t0\t1
S1-00004\tS3-00068\t1\t1\t1\t1
S1-00004\tS3-00069\t1\t1\t0\t1
S1-00004\tS2-00050\t1\t1\t0\t1
... (Total 83,749 test candidate pairs generated)`;
