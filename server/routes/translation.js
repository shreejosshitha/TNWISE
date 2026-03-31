import { Router } from 'express';

const router = Router();

// Simple mock translation dictionary for demo (en <-> ta)
const translationDict = {
  en: {
    'hello': 'வணக்கம்',
    'world': 'உலகம்',
    'translate': 'மொழிபெயர்க்க',
    'water': 'நீர்',
    'electricity': 'மின்சாரம்',
    'complaint': 'புகார்',
    'payment': 'கட்டணம்',
    'home': 'முகப்பு',
    'login': 'புக் பெறுக',
    'profile': 'சுயவிவரம்'
  },
  ta: {
    'வணக்கம்': 'Hello',
    'உலகம்': 'World',
    'மொழிபெயர்க்க': 'Translate',
    'நீர்': 'Water',
    'மின்சாரம்': 'Electricity',
    'புகார்': 'Complaint',
    'கட்டணம்': 'Payment',
    'முகப்பு': 'Home',
    'புக் பெறுக': 'Login',
    'சுயவிவரம்': 'Profile'
  }
};

// Mock translation function
function mockTranslate(text, sourceLanguage = 'en', targetLanguage = 'ta') {
  const dict = translationDict[sourceLanguage] || {};
  let translated = dict[text.toLowerCase()] || `[Demo: ${text}] (${targetLanguage.toUpperCase()})`;
  
  // Simple reverse for unsupported words
  if (!dict[text.toLowerCase()] && sourceLanguage === 'ta') {
    translated = `[Demo: ${text}] (EN)`;
  }
  
  return translated;
}

router.post('/', (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'text is required'
      });
    }

    const translatedText = mockTranslate(text, sourceLanguage, targetLanguage);
    
    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;

