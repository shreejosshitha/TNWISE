import { useState } from 'react';
import { translationService, TranslationRequest } from '../services/translationService';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (request: TranslationRequest) => {
    setIsTranslating(true);
    try {
      const result = await translationService.translate(request);
      return result;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateBatch = async (texts: string[], targetLanguage: string, sourceLanguage?: string) => {
    setIsTranslating(true);
    try {
      const results = await translationService.translateBatch(texts, targetLanguage, sourceLanguage);
      return results;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translateText,
    translateBatch,
    isTranslating,
  };
};