
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TruthEntry {
  title: string;
  description: string;
}

export interface AnalysisResult {
  bsScore: number;
  truths: TruthEntry[];
  summary: string;
  sources: GroundingSource[];
}

export interface AppState {
  loading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  query: string;
}
