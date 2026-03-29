// Translation Service
const API_BASE = '/api';

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  success: boolean;
  data?: {
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
  };
  message?: string;
  error?: string;
}

export const translationService = {
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${API_BASE}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const result = await response.json();
      
      // Handle case where translation service is not configured
      if (!result.success && result.message === 'Translation service not configured') {
        return {
          success: false,
          message: 'Google Cloud Translation is not configured. Please set up Google Cloud credentials to enable translation features.',
          error: 'SERVICE_NOT_CONFIGURED'
        };
      }
      
      return result;
    } catch (error) {
      console.error('Translation request failed:', error);
      return {
        success: false,
        message: 'Network error occurred',
        error: error.message,
      };
    }
  },

  // Helper function to translate multiple texts
  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage?: string): Promise<TranslationResponse[]> {
    const promises = texts.map(text => 
      this.translate({ text, targetLanguage, sourceLanguage })
    );
    return Promise.all(promises);
  },

  // Check if translation service is available
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test', targetLanguage: 'es' }),
      });
      const result = await response.json();
      return result.success !== false || result.message !== 'Translation service not configured';
    } catch {
      return false;
    }
  }
};