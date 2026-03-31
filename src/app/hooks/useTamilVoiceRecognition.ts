import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VoiceCommand {
  action: string;
  target: string;
  confidence?: number;
  matchedPhrase?: string;
}

interface NlpResult {
  command: VoiceCommand | null;
  entities: any[];
  confidence: number;
}

export function useTamilVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [command, setCommand] = useState<VoiceCommand | null>(null);
  const [language, setLanguage] = useState<'ta-IN' | 'en-US'>('ta-IN');
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize Google Speech-to-Text API
  useEffect(() => {
    const initGoogleSpeech = async () => {
      try {
        const response = await fetch('/api/speech-to-text/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language })
        });
        const data = await response.json();
        setRecognition(data.sessionId);
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
      }
    };

    initGoogleSpeech();
  }, [language]);

  const startListening = async () => {
    try {
      setIsListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Record audio for a few seconds
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioBytes = await audioBlob.arrayBuffer();

        // Send audio to backend API
        const response = await fetch('/api/speech-to-text/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBytes: Array.from(new Uint8Array(audioBytes)),
            language
          })
        });

        const result: {
          transcript: string;
          command: VoiceCommand | null;
          entities: any[];
          confidence: number;
        } = await response.json();

        setTranscript(result.transcript);
        setCommand(result.command);
        setIsListening(false);

        // Execute command if recognized
        if (result.command && result.confidence > 0.6) {
          executeCommand(result.command);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();

      // Stop recording after 3 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);

    } catch (error) {
      console.error('Voice recognition error:', error);
      const errorMessage = language === 'ta-IN'
        ? 'மன்னிக்கவும், குரல் அங்கீகாரம் தோல்வியடைந்தது'
        : 'Sorry, voice recognition failed';
      toast.error(errorMessage);
      setIsListening(false);
    }
  };

  const executeCommand = (cmd: VoiceCommand) => {
    switch (cmd.action) {
      case 'navigate':
        // Handle navigation commands
        handleNavigation(cmd.target);
        break;
      case 'submit':
        // Handle submission commands
        handleSubmission(cmd.target);
        break;
      case 'pay':
        // Handle payment commands
        handlePayment(cmd.target);
        break;
      case 'check':
        // Handle status check commands
        handleStatusCheck(cmd.target);
        break;
      case 'help':
        // Show help
        showHelp();
        break;
      case 'language':
        // Switch language
        switchLanguage(cmd.target);
        break;
      default:
        console.log('Unknown command:', cmd);
    }
  };

  const handleNavigation = (target: string) => {
    const routes = {
      dashboard: '/',
      complaints: '/complaints',
      water: '/water-services',
      electricity: '/electricity-services'
    };

    const route = routes[target as keyof typeof routes];
    if (route) {
      window.location.href = route;
      toast.success(language === 'ta-IN' ? 'பக்கம் மாற்றப்பட்டது' : 'Navigated to page');
    }
  };

  const handleSubmission = (target: string) => {
    if (target === 'complaint') {
      // Trigger complaint submission
      toast.success(language === 'ta-IN' ? 'புகார் சமர்ப்பிக்கப்படுகிறது...' : 'Submitting complaint...');
      // You can emit an event or call a callback here
    }
  };

  const handlePayment = (target: string) => {
    if (target === 'bill') {
      toast.success(language === 'ta-IN' ? 'பில் செலுத்தப்படுகிறது...' : 'Processing payment...');
      // Trigger payment flow
    }
  };

  const handleStatusCheck = (target: string) => {
    if (target === 'status') {
      toast.success(language === 'ta-IN' ? 'நிலை சரிபார்க்கப்படுகிறது...' : 'Checking status...');
      // Trigger status check
    }
  };

  const showHelp = () => {
    const helpMessage = language === 'ta-IN'
      ? 'கிடைக்கும் கட்டளைகள்: டாஷ்போர்டுக்கு செல், புகார் செய், பில் செலுத்து, நிலை பார், உதவி'
      : 'Available commands: go to dashboard, submit complaint, pay bill, check status, help';
    toast.info(helpMessage);
  };

  const switchLanguage = (target: string) => {
    if (target === 'ta') {
      setLanguage('ta-IN');
      toast.success('தமிழ் மொழிக்கு மாற்றப்பட்டது');
    } else if (target === 'en') {
      setLanguage('en-US');
      toast.success('Switched to English');
    }
  };

  const processTextCommand = async (text: string) => {
    try {
      const response = await fetch('/api/speech-to-text/process-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, language })
      });

      const result = await response.json();
      setCommand(result.command);

      if (result.command && result.confidence > 0.6) {
        executeCommand(result.command);
      }

      return result;
    } catch (error) {
      console.error('Text command processing error:', error);
    }
  };

  return {
    isListening,
    transcript,
    command,
    language,
    startListening,
    stopListening: () => setIsListening(false),
    switchLanguage,
    processTextCommand,
    setLanguage
  };
}