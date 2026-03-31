
  # Smart public services

  This is a code bundle for Smart public services. The original project is available at https://www.figma.com/design/mHehyB7we97pc8vwJ496An/Smart-public-services.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Features

  ### NLP-Based Voice Commands

  The application supports natural language processing (NLP) powered voice commands in both English and Tamil. Users can speak commands to navigate the application and perform actions.

  #### Supported Voice Commands

  **English Commands:**
  - "Go to dashboard" / "Show dashboard" / "Open dashboard"
  - "Go to complaints" / "Show complaints" / "Open complaints"
  - "Go to water" / "Show water services" / "Open water"
  - "Go to electricity" / "Show electricity services" / "Open electricity"
  - "Submit complaint" / "File complaint" / "Report issue"
  - "Pay bill" / "Make payment"
  - "Check status" / "View status"
  - "Help" / "Show help"
  - "Switch to Tamil" / "Switch to English"

  **Tamil Commands:**
  - "டாஷ்போர்டுக்கு செல்" / "டாஷ்போர்ட் காட்சி" / "டாஷ்போர்ட் திற"
  - "புகார்களுக்கு செல்" / "புகார்கள் காட்சி" / "புகார்கள் திற"
  - "நீர் சேவைக்கு செல்" / "நீர் சேவை காட்சி" / "நீர் சேவை திற"
  - "மின்சார சேவைக்கு செல்" / "மின்சார சேவை காட்சி" / "மின்சார சேவை திற"
  - "புகார் சமர்ப்பி" / "புகார் செய்" / "சிக்கலை தெரிவி"
  - "பில் செலுத்து" / "பணம் செலுத்து"
  - "நிலையை சரிபார்" / "நிலை பார்"
  - "உதவி" / "உதவி காட்சி"
  - "தமிழுக்கு மாற்று" / "ஆங்கிலத்துக்கு மாற்று"

  #### How to Use

  1. Open the AI Chatbot (message icon in the bottom right)
  2. Click the microphone icon to start voice recognition
  3. Speak a command in either English or Tamil
  4. The system will process your speech using NLP and execute the appropriate action

  The voice commands work through the AI Chatbot component and use Google Cloud Speech-to-Text API combined with Google Cloud Natural Language API for accurate command recognition and processing.
  