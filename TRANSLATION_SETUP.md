# Google Cloud Translation Setup

To enable Google Cloud Translation API for bilingual support:

## 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

## 2. Enable Translation API
1. Go to "APIs & Services" > "Library"
2. Search for "Cloud Translation API"
3. Click "Enable"

## 3. Create Service Account Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details
4. Create a JSON key for the service account
5. Download the JSON file

## 4. Set Environment Variables
Set the following environment variables in your `.env` file:

```bash
# Path to your service account key JSON file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json

# Or set the project ID directly
GOOGLE_CLOUD_PROJECT=your-project-id
```

## 5. Restart the Backend
Restart the backend server to pick up the new environment variables.

## Features Added:
- Translation API endpoint at `/api/translate`
- TranslationButton component for on-demand translation
- Enhanced AI Chatbot with language selection and translation
- Header includes a demo translation button

## Usage:
- Use the TranslationButton component to translate text
- Select different languages in the AI Chatbot
- The system falls back gracefully if translation service is not configured