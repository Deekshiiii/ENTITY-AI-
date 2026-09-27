export interface BusinessEntity {
  id: string; // e.g. "S1-00002"
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone?: string;
  source: 'S1' | 'S2' | 'S3';
}

export interface MatchedEntityDetail {
  id: string;
  source: 'S2' | 'S3';
  name: string;
  address: string;
  city: string;
  country: string;
  variationType: 'Exact Match' | 'Legal Suffix Variation' | 'Abbreviation' | 'Address Typo' | 'Token Permutation';
  similarityScore: number;
  levenshteinScore: number;
  jaccardScore: number;
  tfidfScore: number;
  addressScore: number;
}

export interface EntityMatchResult {
  source1Entity: BusinessEntity;
  matchedEntities: MatchedEntityDetail[];
  isSingleton: boolean;
  matchCount: number;
  candidatePairCount: number;
  status: 'matched' | 'singleton';
}

export interface FeatureMetric {
  name: string;
  category: 'Name' | 'Address' | 'Country' | 'Statistical';
  importance: number; // percentage
  description: string;
  formula: string;
}

export interface BlockingStageInfo {
  stage: number;
  name: string;
  description: string;
  candidatesGenerated: number;
  dedupedIncremental: number;
  reductionRate: string;
  keyRule: string;
}

export interface ValidationItem {
  id: string;
  category: 'TRUE MATCH' | 'FALSE MATCH' | 'MISSED MATCH' | 'TRUE NON-MATCH';
  source1: {
    id: string;
    name: string;
    address: string;
    country: string;
  };
  candidate: {
    id: string;
    name: string;
    address: string;
    country: string;
  };
  probability: number;
  actualLabel: 1 | 0;
  predictedLabel: 1 | 0;
  features: {
    nameSimilarity: number;
    addressSimilarity: number;
    countrySimilarity: number;
    tokenOverlap: number;
    charSimilarity: number;
    numericOverlap: number;
  };
  explanation: string;
}

export interface HumanReviewItem {
  id: string; // Review queue ID e.g. "REV-001"
  source1Id: string;
  source1Name: string;
  source1Address: string;
  source1Country: string;
  candidateId: string;
  candidateSource: 'S2' | 'S3';
  candidateName: string;
  candidateAddress: string;
  candidateCountry: string;
  similarityScore: number;
  features: {
    nameSimilarity: number;
    addressSimilarity: number;
    tokenOverlap: number;
    countryMatch: number;
    numericOverlap: number;
  };
  modelDecision: 'MATCH' | 'NO MATCH';
  reviewReason: 'Low Confidence' | 'Name Conflict' | 'Address Conflict' | 'Missing Data' | 'Potential Duplicate';
  status: 'pending' | 'confirmed' | 'rejected';
  userNotes?: string;
  decidedAt?: string;
}

export interface WhatIfConfig {
  nameWeight: number; // default 0.45
  addressWeight: number; // default 0.30
  countryWeight: number; // default 0.15
  tokenWeight: number; // default 0.10
  threshold: number; // default 0.50
}

export interface ExperimentRecord {
  id: string;
  name: string;
  timestamp: string;
  model: string;
  features: string;
  threshold: number;
  precision: number;
  recall: number;
  f05: number;
  candidateCount: number;
  notes: string;
}

export interface DatasetStats {
  source1Count: number;
  source2Count: number;
  source3Count: number;
  candidatePairsTrain: number;
  candidatePairsTest: number;
  groundTruthMatches: number;
  testPredictedMatches: number;
  countriesCount: number;
  missingValues: {
    field: string;
    source1Missing: number;
    source2Missing: number;
    source3Missing: number;
  }[];
  countryDistribution: {
    country: string;
    count: number;
    percentage: number;
  }[];
  nameLengthDistribution: {
    bucket: string;
    s1: number;
    s2: number;
    s3: number;
  }[];
  addressLengthDistribution: {
    bucket: string;
    s1: number;
    s2: number;
    s3: number;
  }[];
}

export interface PipelineStageStatus {
  id: string;
  name: string;
  order: number;
  status: 'Completed' | 'Running' | 'Not started' | 'Needs attention';
  metrics: string;
  description: string;
  targetTab?: string;
}
