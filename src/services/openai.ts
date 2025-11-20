import axios from 'axios';
import { ProcessingResponse } from '../types';
import * as FileSystem from 'expo-file-system';

// TODO: Move to .env or secure storage in production
// For this prototype, we will ask the user to input it or hardcode it temporarily for testing if provided.
// Ideally, use a proxy server to hide the key.
let API_KEY = ''; 

export const setOpenAIApiKey = (key: string) => {
  API_KEY = key;
};

const BASE_URL = 'https://api.openai.com/v1';

export const OpenAIService = {
  async transcribeAudio(uri: string): Promise<string> {
    if (!API_KEY) throw new Error('API Key not set');

    const formData = new FormData();
    // @ts-ignore - React Native FormData polyfill expects this structure
    formData.append('file', {
      uri,
      type: 'audio/m4a', // Adjust based on actual recording type
      name: 'audio.m4a',
    });
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post(`${BASE_URL}/audio/transcriptions`, formData, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  },

  async generateStudyMaterials(transcription: string): Promise<ProcessingResponse> {
    if (!API_KEY) throw new Error('API Key not set');

    const prompt = `
      Analyze the following lecture transcription and generate study materials.
      Return the output strictly in valid JSON format with the following structure:
      {
        "summary": "A concise summary of the lecture (max 200 words)",
        "flashcards": [
          {"id": "1", "front": "Question/Term", "back": "Answer/Definition"},
          ... (generate 5-10 key flashcards)
        ],
        "notes": "A structured conspectus/notes of the lecture using markdown formatting"
      }

      Transcription:
      ${transcription}
    `;

    try {
      const response = await axios.post(
        `${BASE_URL}/chat/completions`,
        {
          model: 'gpt-4o', // or gpt-3.5-turbo
          messages: [
            { role: 'system', content: 'You are a helpful study assistant. You output only valid JSON.' },
            { role: 'user', content: prompt },
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }
};
