export type RepetitionMode = 'x2' | 'x3' | 'adaptive' | 'selective' | 'neural-reasoning';

export interface OptimizationOptions {
  mode?: RepetitionMode;
  segments?: string[];
  model?: string;
  enableAlignment?: boolean;
  enableIntentExpansion?: boolean;
  enableEntropyMonitoring?: boolean;
  enableLatentAnchoring?: boolean;
}

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  mode: RepetitionMode;
  latencyMs: number;
  taskType?: string;
  repetitionCount?: number;
  confidenceScore?: number;
  alignmentStatus?: 'passed' | 'flagged';
  entropyLevel?: 'low' | 'medium' | 'high';
  intentExpanded?: boolean;
  anchorsApplied?: boolean;
}

export interface ExecutionResult extends OptimizationResult {
  output: string;
}
