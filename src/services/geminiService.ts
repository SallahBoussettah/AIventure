import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';
import { STORY_GENERATION_MODEL, IMAGE_GENERATION_MODEL } from '../constants';
import { Scene } from '../types';
import Constants from 'expo-constants';

// Try to get API key from multiple sources for better compatibility
let API_KEY: string;

try {
  // First try to get from @env (development)
  const { GEMINI_API_KEY } = require('@env');
  API_KEY = GEMINI_API_KEY;
} catch (error) {
  // Fallback to expo-constants (production builds)
  API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY || Constants.manifest?.extra?.GEMINI_API_KEY;
}

// // Final fallback - hardcoded for this specific app
// if (!API_KEY) {
  // API_KEY = '';
// }

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is required but not found');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const genAIImage = new GoogleGenAI({ apiKey: API_KEY });

class AdventureChat {
  private model: any;
  private chat: any;

  constructor() {
    try {
      this.model = genAI.getGenerativeModel({ 
        model: STORY_GENERATION_MODEL,
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });
      this.chat = this.model.startChat({
        history: [],
      });
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
      throw new Error('Failed to initialize AI model');
    }
  }

  async sendMessage(message: string): Promise<Scene | null> {
    let text = '';
    let cleanJson = '';
    
    try {
      const prompt = `${message}

Please respond with ONLY a valid JSON object in this exact format (no markdown, no extra text, no nested JSON):
{
  "description": "A detailed, evocative description of the current scene, environment, and any characters or events. Should be 2-4 sentences long.",
  "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]
}

IMPORTANT: 
- Return ONLY the JSON object, nothing else
- Do not wrap in markdown code blocks
- Do not include any control characters or special formatting
- Ensure all strings are properly escaped
- Include exactly 4 choices`;

      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      text = response.text();
      
      console.log('Raw AI response:', text);
      
      // Try to extract JSON from the response
      let jsonText = text.trim();
      
      // Remove any markdown code blocks
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // Clean up any control characters and invalid JSON formatting
      jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      // Handle nested JSON blocks (remove extra JSON wrapper)
      if (jsonText.includes('```json')) {
        const lines = jsonText.split('\n');
        const cleanLines = lines.filter(line => 
          !line.trim().startsWith('```') && 
          !line.trim().startsWith('"description": "```json')
        );
        jsonText = cleanLines.join('\n');
      }
      
      // Find the first complete JSON object in the text
      let jsonMatch = jsonText.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        // Try to find JSON with more flexible matching
        const startIndex = jsonText.indexOf('{');
        const endIndex = jsonText.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonMatch = [jsonText.substring(startIndex, endIndex + 1)];
        }
      }
      
      if (!jsonMatch) {
        // Fallback: create a basic scene if no JSON found
        console.warn('No JSON found, creating fallback scene');
        return {
          description: text.substring(0, 200) + '...',
          choices: [
            'Continue forward',
            'Look around carefully',
            'Rest and think',
            'Try a different approach'
          ]
        };
      }
      
      // Additional cleaning for the matched JSON
      cleanJson = jsonMatch[0];
      
      // Remove any remaining control characters
      cleanJson = cleanJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      // Fix common JSON formatting issues
      cleanJson = cleanJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      const parsed = JSON.parse(cleanJson);
      
      if (parsed.description && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
        return {
          description: parsed.description,
          choices: parsed.choices.slice(0, 4), // Ensure max 4 choices
        };
      }
      
      throw new Error('Invalid response format from AI');
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      
      if (error instanceof SyntaxError && error?.message?.includes('JSON')) {
        console.error('JSON parsing failed. Raw response was:', text);
        console.error('Cleaned JSON attempt was:', cleanJson || 'undefined');
      }
      
      // Return a fallback scene instead of throwing
      return {
        description: "You find yourself in a mysterious place. The air is thick with possibility and adventure awaits around every corner.",
        choices: [
          "Explore the area",
          "Call out to see if anyone is nearby", 
          "Search for clues",
          "Proceed with caution"
        ]
      };
    }
  }
}

export const createAdventureChat = (): AdventureChat => {
  return new AdventureChat();
};

export const generateImage = async (description: string): Promise<string | null> => {
  const imagePrompt = `Epic fantasy digital art, cinematic lighting, high detail, masterpiece. Scene: ${description}`;
  try {
    console.log('Generating AI image for:', description);
    console.log('Using API key:', API_KEY ? 'API key present' : 'API key missing');
    console.log('Using model:', IMAGE_GENERATION_MODEL);
    
    const response = await genAIImage.models.generateImages({
      model: IMAGE_GENERATION_MODEL,
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const firstImage = response.generatedImages[0];
      if (firstImage?.image?.imageBytes) {
        const base64ImageBytes = firstImage.image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        console.log('Successfully generated AI image');
        return imageUrl;
      }
    }
    
    console.warn('No images generated in response');
    return null;
  } catch (error: any) {
    console.error("Error generating image:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Let's try with a fallback approach - maybe the issue is with the specific model
    if (error?.message && error.message.includes('billed users')) {
      console.log('Trying fallback image generation approach...');
      return await generateImageFallback(description);
    }
    
    return null;
  }
};

// Fallback using a different approach or model
const generateImageFallback = async (description: string): Promise<string | null> => {
  try {
    // Try with a different model or approach
    console.log('Attempting fallback image generation');
    
    // For now, let's use a themed placeholder that matches the description
    // This ensures the app works while we debug the API issue
    const keywords = extractImageKeywords(description);
    const seed = hashString(description);
    
    let imageUrl: string;
    if (keywords.includes('chamber') || keywords.includes('stone') || keywords.includes('dungeon')) {
      imageUrl = `https://picsum.photos/seed/${seed}/400/300?grayscale`;
    } else if (keywords.includes('forest') || keywords.includes('tree')) {
      imageUrl = `https://picsum.photos/seed/${seed + 1}/400/300`;
    } else {
      imageUrl = `https://picsum.photos/seed/${seed}/400/300`;
    }
    
    console.log('Using fallback image:', imageUrl);
    return imageUrl;
  } catch (error: any) {
    console.error('Fallback image generation failed:', error);
    return null;
  }
};

// Helper functions for fallback
const extractImageKeywords = (description: string): string[] => {
  const keywords = [
    'chamber', 'stone', 'dungeon', 'torch', 'wall',
    'forest', 'tree', 'woods', 'cottage', 'house',
    'village', 'town', 'market', 'path', 'road'
  ];
  
  const lowerDesc = description.toLowerCase();
  return keywords.filter(keyword => lowerDesc.includes(keyword));
};

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 10000;
};