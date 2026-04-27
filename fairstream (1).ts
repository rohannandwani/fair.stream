// FairStream Type Definitions

export interface ContentSource {
  id: string;
  name: string;
  bias: 'left' | 'center' | 'right' | 'neutral';
  neutralityScore: number;
  category: string;
  blockchainHash?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  source: ContentSource;
  timestamp: Date;
  biasAlignment: number;
  diversityScore: number;
}

export interface SerendipitySettings {
  echoChamberStrength: number; // 0-100
  diversityTarget: number; // 0-100
  opposingViewpointRatio: number; // 0-100
}

export interface SemanticDriftData {
  politicalLean: number; // -100 (left) to +100 (right)
  topicDiversity: number; // 0-100
  demographicBias: number; // 0-100
  ideologicalSpread: number; // 0-100
  alerts: DriftAlert[];
}

export interface DriftAlert {
  id: string;
  type: 'political' | 'demographic' | 'ideological' | 'topic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  recommendation: string;
}

export interface BlockchainCitation {
  id: string;
  contentId: string;
  sourceUrl: string;
  sourceName: string;
  neutralityScore: number;
  verificationHash: string;
  timestamp: Date;
  network: string;
  blockNumber: number;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  source: string;
  bias: 'left' | 'center' | 'right';
  timestamp: Date;
  category: string;
  neutralityScore: number;
  citation?: BlockchainCitation;
}

export interface UserPreferences {
  serendipity: SerendipitySettings;
  notifications: boolean;
  driftAlertThreshold: 'low' | 'medium' | 'high';
}
