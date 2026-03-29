import { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';

interface TranslationButtonProps {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  onTranslated?: (translatedText: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function TranslationButton({
  text,
  targetLanguage,
  sourceLanguage = 'en',
  onTranslated,
  variant = 'outline',
  size = 'sm',
  className = '',
}: TranslationButtonProps) {
  const [translatedText, setTranslatedText] = useState<string>('');
  const { translateText, isTranslating } = useTranslation();

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error('No text to translate');
      return;
    }

    const result = await translateText({
      text: text.trim(),
      targetLanguage,
      sourceLanguage,
    });

    if (result.success && result.data) {
      setTranslatedText(result.data.translatedText);
      onTranslated?.(result.data.translatedText);
      toast.success(`Translated to ${targetLanguage.toUpperCase()}`);
    } else if (result.error === 'SERVICE_NOT_CONFIGURED') {
      toast.info('Translation service is not configured. This is a demo feature.');
      // Still show the original text for demo purposes
      setTranslatedText(`[Demo] ${text} (translated to ${targetLanguage})`);
      onTranslated?.(`[Demo] ${text} (translated to ${targetLanguage})`);
    } else {
      toast.error(result.message || 'Translation failed');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleTranslate}
        disabled={isTranslating || !text.trim()}
        className={className}
      >
        {isTranslating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Languages className="w-4 h-4" />
        )}
        {isTranslating ? 'Translating...' : `Translate to ${targetLanguage.toUpperCase()}`}
      </Button>
      
      {translatedText && (
        <div className="text-sm text-gray-600 max-w-xs">
          <strong>Translation:</strong> {translatedText}
        </div>
      )}
    </div>
  );
}