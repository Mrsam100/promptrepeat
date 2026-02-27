import { GoogleGenAI } from "@google/genai";
import type { RepetitionMode, OptimizationOptions, OptimizationResult, ExecutionResult } from "./types";

// Re-export types for backward compatibility
export type { RepetitionMode, OptimizationOptions, OptimizationResult, ExecutionResult } from "./types";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}

export class PromptEngine {
  private static async classifyTask(prompt: string): Promise<'reasoning' | 'extraction' | 'creative' | 'classification'> {
    const ai = getAI();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classify the following prompt into one of these categories: reasoning, extraction, creative, classification. Respond with ONLY the category name.

        Prompt: ${prompt.substring(0, 500)}`,
      });

      const category = response.text?.toLowerCase().trim() || 'classification';
      if (['reasoning', 'extraction', 'creative', 'classification'].includes(category)) {
        return category as 'reasoning' | 'extraction' | 'creative' | 'classification';
      }
    } catch (e) {
      console.error("Classification failed, defaulting to classification", e);
    }
    return 'classification';
  }

  private static async expandIntent(prompt: string): Promise<string> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the user's intent in this prompt and expand it with necessary context, constraints, and implicit goals to ensure the LLM has a foundational understanding. Respond with ONLY the expanded prompt.

        Original Prompt: ${prompt}`,
      });
      return response.text || prompt;
    } catch (e) {
      return prompt;
    }
  }

  static async optimize(prompt: string, options: OptimizationOptions = {}): Promise<OptimizationResult> {
    const start = performance.now();
    const { mode = 'x2', segments, enableIntentExpansion, enableLatentAnchoring } = options;

    let workingPrompt = prompt;
    let intentExpanded = false;
    let anchorsApplied = false;

    if (enableIntentExpansion) {
      workingPrompt = await this.expandIntent(prompt);
      intentExpanded = true;
    }

    if (enableLatentAnchoring) {
      workingPrompt = `[ANCHOR: FOUNDATIONAL CONSTRAINTS ENABLED]\n${workingPrompt}\n\n[ANCHOR: MAINTAIN SEMANTIC COHERENCE TO ORIGINAL INTENT]`;
      anchorsApplied = true;
    }

    let optimized = workingPrompt;
    let taskType = 'unknown';
    let repetitionCount = 1;

    switch (mode) {
      case 'x2':
        optimized = `${workingPrompt}\n\n${workingPrompt}`;
        repetitionCount = 2;
        break;
      case 'x3':
        optimized = `${workingPrompt}\n\n${workingPrompt}\n\n${workingPrompt}`;
        repetitionCount = 3;
        break;
      case 'selective':
        const markerRegex = /\[\[(.*?)\]\]/g;
        const matches = [...workingPrompt.matchAll(markerRegex)];

        if (matches.length > 0) {
          let additions = "\n\nREPEATED KEY INSTRUCTIONS:\n";
          matches.forEach(match => {
            additions += `- ${match[1]}\n`;
          });
          const cleanedPrompt = workingPrompt.replace(markerRegex, '$1');
          optimized = `${cleanedPrompt}${additions}${additions}`;
          repetitionCount = 1 + (matches.length * 0.2);
        } else if (segments && segments.length > 0) {
          let additions = "\n\nREPEATED SEGMENTS:\n";
          segments.forEach(s => {
            additions += `${s}\n`;
          });
          optimized = `${workingPrompt}${additions}`;
          repetitionCount = 1 + (segments.length * 0.2);
        } else {
          optimized = `${workingPrompt}\n\n${workingPrompt}`;
          repetitionCount = 2;
        }
        break;
      case 'adaptive':
        taskType = await this.classifyTask(workingPrompt);

        if (taskType === 'extraction' || taskType === 'classification') {
          const threshold = 300;
          if (workingPrompt.length < threshold) {
            optimized = `${workingPrompt}\n\n${workingPrompt}\n\n${workingPrompt}`;
            repetitionCount = 3;
          } else {
            optimized = `${workingPrompt}\n\n${workingPrompt}`;
            repetitionCount = 2;
          }
        } else if (taskType === 'reasoning') {
          optimized = `${workingPrompt}\n\n[REINFORCEMENT: LOGICAL ANCHORING]\nCarefully analyze the constraints provided in the initial prompt. Ensure every step of your reasoning is explicitly linked to these constraints. Avoid logical leaps and verify your final conclusion against the original requirements for absolute consistency.`;
          repetitionCount = 1.1;
        } else if (taskType === 'creative') {
          optimized = `[CREATIVE ANCHOR: MAINTAIN NARRATIVE COHERENCE]\n${workingPrompt}\n\n[INSTRUCTION: Expand on the implicit themes while adhering strictly to the stylistic constraints defined above.]`;
          repetitionCount = 1.2;
        } else {
          optimized = `${workingPrompt}\n\n${workingPrompt}`;
          repetitionCount = 2;
        }
        break;
      case 'neural-reasoning':
        optimized = `[SYSTEM: DEEP REASONING MODE ENABLED]\n${workingPrompt}\n\n[INSTRUCTION: Think step-by-step. Analyze your own logic for contradictions. Verify every claim before finalizing.]`;
        repetitionCount = 1;
        break;
    }

    const end = performance.now();
    return {
      originalPrompt: prompt,
      optimizedPrompt: optimized,
      mode,
      latencyMs: Math.round(end - start),
      taskType,
      repetitionCount,
      intentExpanded,
      anchorsApplied
    };
  }

  static async execute(prompt: string, options: OptimizationOptions = {}): Promise<ExecutionResult> {
    const ai = getAI();
    const optimization = await this.optimize(prompt, options);
    const model = options.model || 'gemini-3-flash-preview';

    let responseText = "";
    let alignmentStatus: 'passed' | 'flagged' = 'passed';
    let confidenceScore = 0.95;

    if (options.mode === 'neural-reasoning') {
      const pass1 = await ai.models.generateContent({
        model,
        contents: optimization.optimizedPrompt,
      });

      const pass2 = await ai.models.generateContent({
        model,
        contents: `Original Task: ${prompt}\n\nInitial Draft: ${pass1.text}\n\n[CRITICAL REVIEW]: Identify any logical flaws, factual errors, or missing constraints in the draft above. Provide the corrected, final response.`,
      });

      responseText = pass2.text || "";
      confidenceScore = 0.98;
    } else {
      const response = await ai.models.generateContent({
        model,
        contents: optimization.optimizedPrompt,
      });
      responseText = response.text || "";
    }

    if (options.enableAlignment) {
      const alignmentCheck = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following AI output for alignment with safety, truthfulness, and helpfulness. Respond with 'passed' or 'flagged'.

        Output: ${responseText.substring(0, 1000)}`,
      });

      alignmentStatus = alignmentCheck.text?.toLowerCase().includes('flagged') ? 'flagged' : 'passed';
    }

    let entropyLevel: 'low' | 'medium' | 'high' = 'low';
    if (options.enableEntropyMonitoring) {
      if (optimization.taskType === 'creative') entropyLevel = 'high';
      else if (optimization.taskType === 'reasoning' && confidenceScore < 0.96) entropyLevel = 'medium';
      else entropyLevel = 'low';
    }

    return {
      ...optimization,
      output: responseText,
      alignmentStatus,
      confidenceScore,
      entropyLevel
    };
  }
}
