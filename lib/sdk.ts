/**
 * PromptRepeat SDK (JavaScript Client)
 * 
 * Usage:
 * const pr = new PromptRepeat('your-api-key');
 * const result = await pr.optimize('Summarize this text...');
 */

export class PromptRepeat {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.promptrepeat.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async optimize(prompt: string, options: { mode?: string; model?: string } = {}) {
    const response = await fetch(`${this.baseUrl}/api/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        mode: options.mode || 'adaptive',
        model: options.model || 'gemini-3-flash-preview',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to optimize prompt');
    }

    return response.json();
  }
}
