import express from 'express';
import speech from '@google-cloud/speech';
import language from '@google-cloud/language';

const router = express.Router();

// Initialize Google Speech client
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Initialize Google Natural Language client
const languageClient = new language.LanguageServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Voice command patterns for English
const englishCommands = {
  // Navigation commands
  'go to dashboard': { action: 'navigate', target: 'dashboard' },
  'show dashboard': { action: 'navigate', target: 'dashboard' },
  'open dashboard': { action: 'navigate', target: 'dashboard' },
  'go to complaints': { action: 'navigate', target: 'complaints' },
  'show complaints': { action: 'navigate', target: 'complaints' },
  'open complaints': { action: 'navigate', target: 'complaints' },
  'go to water': { action: 'navigate', target: 'water' },
  'show water services': { action: 'navigate', target: 'water' },
  'open water': { action: 'navigate', target: 'water' },
  'go to electricity': { action: 'navigate', target: 'electricity' },
  'show electricity services': { action: 'navigate', target: 'electricity' },
  'open electricity': { action: 'navigate', target: 'electricity' },

  // Action commands
  'submit complaint': { action: 'submit', target: 'complaint' },
  'file complaint': { action: 'submit', target: 'complaint' },
  'report issue': { action: 'submit', target: 'complaint' },
  'pay bill': { action: 'pay', target: 'bill' },
  'make payment': { action: 'pay', target: 'bill' },
  'check status': { action: 'check', target: 'status' },
  'view status': { action: 'check', target: 'status' },

  // Utility commands
  'help': { action: 'help', target: 'general' },
  'show help': { action: 'help', target: 'general' },
  'switch to tamil': { action: 'language', target: 'ta' },
  'switch to english': { action: 'language', target: 'en' }
};

// Voice command patterns for Tamil
const tamilCommands = {
  // Navigation commands
  'டாஷ்போர்டுக்கு செல்': { action: 'navigate', target: 'dashboard' },
  'டாஷ்போர்ட் காட்சி': { action: 'navigate', target: 'dashboard' },
  'டாஷ்போர்ட் திற': { action: 'navigate', target: 'dashboard' },
  'புகார்களுக்கு செல்': { action: 'navigate', target: 'complaints' },
  'புகார்கள் காட்சி': { action: 'navigate', target: 'complaints' },
  'புகார்கள் திற': { action: 'navigate', target: 'complaints' },
  'நீர் சேவைக்கு செல்': { action: 'navigate', target: 'water' },
  'நீர் சேவை காட்சி': { action: 'navigate', target: 'water' },
  'நீர் சேவை திற': { action: 'navigate', target: 'water' },
  'மின்சார சேவைக்கு செல்': { action: 'navigate', target: 'electricity' },
  'மின்சார சேவை காட்சி': { action: 'navigate', target: 'electricity' },
  'மின்சார சேவை திற': { action: 'navigate', target: 'electricity' },

  // Action commands
  'புகார் சமர்ப்பி': { action: 'submit', target: 'complaint' },
  'புகார் செய்': { action: 'submit', target: 'complaint' },
  'சிக்கலை தெரிவி': { action: 'submit', target: 'complaint' },
  'பில் செலுத்து': { action: 'pay', target: 'bill' },
  'பணம் செலுத்து': { action: 'pay', target: 'bill' },
  'நிலையை சரிபார்': { action: 'check', target: 'status' },
  'நிலை பார்': { action: 'check', target: 'status' },

  // Utility commands
  'உதவி': { action: 'help', target: 'general' },
  'உதவி காட்சி': { action: 'help', target: 'general' },
  'தமிழுக்கு மாற்று': { action: 'language', target: 'ta' },
  'ஆங்கிலத்துக்கு மாற்று': { action: 'language', target: 'en' }
};

// Function to analyze transcript with NLP
async function analyzeTranscript(transcript, languageCode) {
  try {
    const document = {
      content: transcript,
      type: 'PLAIN_TEXT',
      language: languageCode === 'ta-IN' ? 'ta' : 'en'
    };

    const [result] = await languageClient.analyzeEntities({ document });
    const entities = result.entities;

    // Extract intent and entities
    const intent = extractIntent(transcript, languageCode);
    const extractedEntities = entities.map(entity => ({
      name: entity.name,
      type: entity.type,
      salience: entity.salience
    }));

    return {
      intent,
      entities: extractedEntities,
      confidence: intent ? intent.confidence : 0
    };
  } catch (error) {
    console.error('NLP Analysis Error:', error);
    // Fallback to keyword matching
    return {
      intent: extractIntent(transcript, languageCode),
      entities: [],
      confidence: 0.5
    };
  }
}

// Function to extract intent from transcript
function extractIntent(transcript, languageCode) {
  const commands = languageCode === 'ta-IN' ? tamilCommands : englishCommands;
  const lowerTranscript = transcript.toLowerCase();

  for (const [phrase, command] of Object.entries(commands)) {
    if (lowerTranscript.includes(phrase.toLowerCase())) {
      return {
        ...command,
        confidence: 0.8,
        matchedPhrase: phrase
      };
    }
  }

  return null;
}

// Initialize streaming recognition
router.post('/init', async (req, res) => {
  try {
    const { language = 'ta-IN' } = req.body;

    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: language,
        enableAutomaticPunctuation: true,
        model: 'latest_long',
        useEnhanced: true,
      },
      interimResults: false,
    };

    const [operation] = await speechClient.longRunningRecognize(request);
    res.json({ sessionId: operation.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stream audio for real-time recognition with NLP
router.post('/stream', async (req, res) => {
  try {
    const { audioBytes, language = 'ta-IN' } = req.body; // Audio data and language from frontend

    const request = {
      audio: {
        content: Buffer.from(audioBytes, 'base64'),
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: language,
        enableAutomaticPunctuation: true,
        model: 'latest_long',
        useEnhanced: true,
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcript = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Analyze transcript with NLP
    const nlpResult = await analyzeTranscript(transcript, language);

    res.json({
      transcript,
      command: nlpResult.intent,
      entities: nlpResult.entities,
      confidence: nlpResult.confidence
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for voice commands processing
router.post('/process-command', async (req, res) => {
  try {
    const { transcript, language = 'ta-IN' } = req.body;

    const nlpResult = await analyzeTranscript(transcript, language);

    res.json({
      command: nlpResult.intent,
      entities: nlpResult.entities,
      confidence: nlpResult.confidence,
      originalTranscript: transcript
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;