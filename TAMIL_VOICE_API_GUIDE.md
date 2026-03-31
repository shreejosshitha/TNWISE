# Tamil Voice Command APIs Setup Guide

## 1. Google Cloud Speech-to-Text (Recommended)

### Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Speech-to-Text API"
4. Create a service account key (JSON)
5. Download the key file and place it in your `server/` directory
6. Set environment variable: `GOOGLE_APPLICATION_CREDENTIALS=./path/to/key.json`

### Features:
- ✅ Excellent Tamil support (ta-IN)
- ✅ Real-time streaming
- ✅ Free tier: 60 minutes/month
- ✅ Very accurate for Indian accents

## 2. Azure Speech Services

### Setup:
```bash
npm install @azure/cognitiveservices-speech
```

### Features:
- ✅ Good Tamil support
- ✅ Free tier: 5 hours/month
- ✅ Real-time processing
- ✅ SDK available

## 3. OpenAI Whisper API

### Setup:
```bash
npm install openai
```

### Features:
- ✅ Excellent multilingual support
- ✅ Very accurate for Tamil
- ✅ Easy to implement
- ❌ Paid service ($0.006/minute)

## 4. AssemblyAI

### Setup:
```bash
npm install assemblyai
```

### Features:
- ✅ Real-time streaming
- ✅ Good Tamil support
- ✅ Free tier available
- ✅ Speaker diarization

## Quick Implementation (Google):

```javascript
// In your voice recognition hook
const startTamilVoiceRecognition = async () => {
  try {
    const response = await fetch('/api/speech-to-text/stream', {
      method: 'POST',
      body: audioBlob,
      headers: {
        'Content-Type': 'audio/webm',
        'X-Language': 'ta-IN'
      }
    });
    const result = await response.json();
    return result.transcript;
  } catch (error) {
    console.error('Tamil voice recognition failed:', error);
  }
};
```

## Environment Variables Needed:

```env
# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./server/google-credentials.json

# Azure (alternative)
AZURE_SPEECH_KEY=your_key
AZURE_SPEECH_REGION=eastus

# OpenAI (alternative)
OPENAI_API_KEY=your_key
```

## Current Web Speech API Limitations:

- Limited Tamil vocabulary
- Poor accent recognition
- No real-time streaming
- Browser-dependent accuracy

## Recommendation:

**Start with Google Speech-to-Text** - it's free, accurate for Tamil, and easy to implement for your hackathon project!