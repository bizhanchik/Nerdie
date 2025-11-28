import axios, { AxiosError } from 'axios';
import { ProcessingResponse, ChatMessage, TimestampReference, AIError, ProcessingStep, Lesson, LessonQuestion, UserProfile, SupportedLanguage } from '../types';
import * as FileSystem from 'expo-file-system';
import { NativeModules, Platform } from 'react-native';

// TODO: Move to .env or secure storage in production
// For this prototype, we will ask the user to input it or hardcode it temporarily for testing if provided.
// Ideally, use a proxy server to hide the key.
let API_KEY = ''; 

export const setOpenAIApiKey = (key: string) => {
  API_KEY = key;
};

const BASE_URL = 'https://api.openai.com/v1';

// Helper to get language instruction for AI
const getLanguageInstruction = (language: SupportedLanguage): string => {
  switch (language) {
    case 'ru':
      return 'ВАЖНО: Весь контент урока должен быть на РУССКОМ языке. Генерируй все тексты, вопросы и объяснения на русском.';
    case 'kk':
      return 'МАҢЫЗДЫ: Барлық сабақ мазмұны ҚАЗАҚ тілінде болуы керек. Барлық мәтіндерді, сұрақтарды және түсіндірмелерді қазақ тілінде жаса.';
    case 'en':
    default:
      return 'IMPORTANT: All lesson content should be in ENGLISH. Generate all texts, questions and explanations in English.';
  }
};

// Helper to detect device language
export const detectDeviceLanguage = (): SupportedLanguage => {
  let deviceLanguage = 'en';

  if (Platform.OS === 'ios') {
    deviceLanguage = NativeModules.SettingsManager?.settings?.AppleLocale ||
                     NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
                     'en';
  } else if (Platform.OS === 'android') {
    deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
  }

  const langCode = deviceLanguage.split('_')[0].toLowerCase();

  if (langCode === 'ru' || langCode.startsWith('ru')) {
    return 'ru';
  } else if (langCode === 'kk' || langCode.startsWith('kk')) {
    return 'kk';
  }
  return 'en';
};

// Helper function to create AIError from caught errors
const createAIError = (error: any, step?: ProcessingStep): AIError => {
  if (!API_KEY) {
    return {
      type: 'api_key_missing',
      message: 'OpenAI API key is not configured. Please add your API key in Settings.',
      step,
      retryable: false,
      originalError: error,
    };
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (!axiosError.response) {
      return {
        type: 'network_error',
        message: 'Network connection failed. Please check your internet connection and try again.',
        step,
        retryable: true,
        originalError: error,
      };
    }

    const status = axiosError.response.status;
    const errorData = axiosError.response.data;

    if (status === 401 || status === 403) {
      return {
        type: 'api_key_invalid',
        message: 'Invalid API key. Please check your OpenAI API key in Settings.',
        step,
        retryable: false,
        originalError: error,
      };
    }

    if (status === 429) {
      return {
        type: 'rate_limit',
        message: 'Rate limit exceeded. Please wait a moment and try again.',
        step,
        retryable: true,
        originalError: error,
      };
    }

    if (status >= 500) {
      return {
        type: 'network_error',
        message: 'OpenAI server error. Please try again in a few moments.',
        step,
        retryable: true,
        originalError: error,
      };
    }

    // Check for specific error messages
    if (errorData?.error?.message) {
      return {
        type: step === 'transcription' ? 'transcription_failed' : 'generation_failed',
        message: `AI service error: ${errorData.error.message}`,
        step,
        retryable: true,
        originalError: error,
      };
    }
  }

  return {
    type: 'unknown',
    message: error.message || 'An unexpected error occurred. Please try again.',
    step,
    retryable: true,
    originalError: error,
  };
};

export const OpenAIService = {
  async generateLectureTitle(transcriptionSnippet: string): Promise<string> {
    if (!API_KEY) {
      throw createAIError(new Error('API Key not set'), 'title_generation');
    }

    const prompt = `Analyze this lecture snippet and generate a concise, descriptive title.
Format: "Subject — Specific Topic"
Examples:
- "Linear Algebra — Matrix Transformations"
- "Biology — Cellular Respiration Process"
- "History — The French Revolution"

Keep it under 60 characters and be specific.

Lecture snippet:
${transcriptionSnippet}`;

    try {
      const response = await axios.post(
        `${BASE_URL}/chat/completions`,
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates concise lecture titles. Output only the title, nothing else.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const title = response.data.choices[0].message.content.trim();
      // Remove quotes if present
      return title.replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Title generation error:', error);
      throw createAIError(error, 'title_generation');
    }
  },

  async transcribeAudio(uri: string): Promise<string> {
    if (!API_KEY) {
      throw createAIError(new Error('API Key not set'), 'transcription');
    }

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
      throw createAIError(error, 'transcription');
    }
  },

  async generateStudyMaterials(transcription: string): Promise<ProcessingResponse> {
    if (!API_KEY) {
      throw createAIError(new Error('API Key not set'), 'study_materials');
    }

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
      throw createAIError(error, 'study_materials');
    }
  },

  async chatAboutLecture(
    transcription: string,
    notes: string | undefined,
    chatHistory: ChatMessage[],
    userQuestion: string
  ): Promise<{ content: string; references: TimestampReference[] }> {
    if (!API_KEY) {
      throw createAIError(new Error('API Key not set'));
    }

    const systemPrompt = `You are an AI assistant helping students understand their lecture content.
You have access to the full lecture transcription and notes.
Answer questions based ONLY on the lecture content provided.
When referencing specific parts of the lecture, you MUST provide timestamp references.

When you mention something from the lecture, include a reference in this format:
[REF: start_seconds-end_seconds: "exact quote from transcription"]

For example: "The professor discussed photosynthesis [REF: 120-145: "photosynthesis is the process by which plants convert light energy"] in the middle of the lecture."

Be concise, helpful, and accurate. Always cite your sources with timestamp references.`;

    const contextPrompt = `
LECTURE TRANSCRIPTION:
${transcription}

${notes ? `LECTURE NOTES:\n${notes}\n` : ''}

Now answer the student's question based on this lecture content.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: contextPrompt },
    ];

    // Add chat history
    chatHistory.forEach(msg => {
      if (msg.role === 'user') {
        messages.push({ role: 'user', content: msg.content });
      } else {
        messages.push({ role: 'assistant', content: msg.content });
      }
    });

    // Add current question
    messages.push({ role: 'user', content: userQuestion });

    try {
      const response = await axios.post(
        `${BASE_URL}/chat/completions`,
        {
          model: 'gpt-4o',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;

      // Parse references from the content
      const references: TimestampReference[] = [];
      const refRegex = /\[REF:\s*(\d+)-(\d+):\s*"([^"]+)"\]/g;
      let match;

      while ((match = refRegex.exec(content)) !== null) {
        references.push({
          start: parseInt(match[1]),
          end: parseInt(match[2]),
          text: match[3],
        });
      }

      // Remove reference markers from the display content
      const cleanContent = content.replace(refRegex, '').replace(/\s+/g, ' ').trim();

      return {
        content: cleanContent,
        references,
      };
    } catch (error) {
      console.error('Chat error:', error);
      throw createAIError(error);
    }
  },

  async generatePersonalizedLesson(
    lectureTitle: string,
    transcription: string,
    summary: string,
    notes: string,
    userProfile: UserProfile | null
  ): Promise<Omit<Lesson, 'id' | 'lectureId' | 'createdAt' | 'completed'>> {
    if (!API_KEY) {
      throw createAIError(new Error('API Key not set'));
    }

    const language = userProfile?.language || 'en';
    const languageInstruction = getLanguageInstruction(language);

    const personalizationContext = userProfile && userProfile.interests.length > 0
      ? `
The student is ${userProfile.age ? `${userProfile.age} years old and` : ''} interested in: ${userProfile.interests.join(', ')}.
Please adapt explanations and examples to relate to these interests when possible.
For example, if they're interested in "sports", use sports analogies. If interested in "music", use musical examples.
`
      : '';

    const prompt = `You are an expert educational content creator. Create an interactive lesson based on this lecture.

${languageInstruction}

LECTURE INFORMATION:
Title: ${lectureTitle}
Summary: ${summary}

Full Transcription:
${transcription}

Detailed Notes:
${notes}

${personalizationContext}

Create a comprehensive, engaging lesson with the following structure in JSON format:
{
  "title": "Engaging lesson title (different from lecture title, focused on what students will learn)",
  "description": "Brief description of what students will learn (2-3 sentences)",
  "content": "Detailed lesson content in markdown format. Include:
    - Clear explanations of key concepts
    - Examples and analogies ${personalizationContext ? 'related to the student\'s interests' : ''}
    - Visual formatting with headers, bullet points, bold/italic text
    - Should be comprehensive but digestible (aim for ~500-800 words)",
  "questions": [
    {
      "id": "1",
      "type": "multiple_choice" | "true_false",
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Only for multiple_choice, omit for true_false
      "correctAnswer": "The correct answer (must match one of the options for multiple_choice)",
      "explanation": "Why this is correct and what concept it tests"
    },
    ... (generate 5-7 varied questions that test understanding, not just memorization)
  ],
  "estimatedDuration": 15 // Time in minutes to complete the lesson
}

IMPORTANT RULES:
1. ONLY use "multiple_choice" and "true_false" question types. DO NOT use "short_answer" type.
2. For true/false questions, the correctAnswer must be exactly "True" or "False" (or translated equivalents in the target language)
3. Make questions varied in type (mix of multiple choice and true/false)
4. Questions should test understanding, application, and analysis - not just recall
5. For multiple choice, provide 4 plausible options
6. Explanations should teach, not just confirm the answer
7. Content should be engaging and clear
${personalizationContext ? '8. Use examples and analogies that relate to the student\'s interests whenever natural' : ''}`;

    try {
      const response = await axios.post(
        `${BASE_URL}/chat/completions`,
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator who creates engaging, personalized lessons. Output only valid JSON.'
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const lessonData = JSON.parse(content);

      return {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        questions: lessonData.questions,
        estimatedDuration: lessonData.estimatedDuration || 15,
        score: undefined,
        completedAt: undefined,
      };
    } catch (error) {
      console.error('Lesson generation error:', error);
      throw createAIError(error);
    }
  }
};
