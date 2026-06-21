import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackResult, generateLocalFutures } from './carbon-engine';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
let isApiDown = false;

// Set to gemini-3.1-flash as requested by the user
const GEMINI_MODEL = 'gemini-3.1-flash';

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Circuit breaker helper: only disable the API session on rate limit (HTTP 429) or quota errors
function shouldTripCircuitBreaker(error) {
  const status = error?.status || error?.statusCode || 0;
  const msg = (error?.message || '').toLowerCase();
  return (
    status === 429 ||
    msg.includes('429') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('resource_exhausted')
  );
}

// Helper to convert File to GenerativePart
async function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeImage(imageFile, scanType) {
  if (!genAI || isApiDown) {
    console.warn('Gemini API disabled or rate-limited, using fallback local engine.');
    return new Promise(resolve => setTimeout(() => resolve(getFallbackResult(scanType)), 1500));
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
      You are an expert carbon footprint estimator for the Indian context. 
      Analyze this image (type: ${scanType}). 
      Identify the items and estimate the carbon footprint in kg CO2e.
      
      Respond STRICTLY with a valid JSON object matching this schema:
      {
        "inputType": "meal|grocery|receipt|electricity_bill|utility_bill",
        "detectedItems": ["item1", "item2"],
        "estimatedCarbonKg": 0.0,
        "carbonGrade": "A|B|C|D|E",
        "confidence": 0.0,
        "recommendation": "one actionable swap with approximate ₹ savings",
        "carbonStory": "2-3 sentence narrative about the impact",
        "futureImpact": "if this repeats for 30 days...",
        "treeEquivalence": "X trees needed to offset annually",
        "rupeeEquivalent": "Environmental cost: ~₹Y"
      }
      Do not include any markdown formatting like \`\`\`json. Just return the raw JSON object.
    `;

    const result = await Promise.race([
      model.generateContent([prompt, imagePart]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API Timeout')), 10000))
    ]);
    const responseText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (shouldTripCircuitBreaker(error)) {
      isApiDown = true;
      console.warn('Gemini quota exhausted — falling back to local engine for this session.');
    } else {
      console.warn('Transient Gemini error — will retry on next call.', error.message);
    }
    return getFallbackResult(scanType);
  }
}

export async function generateFutures(sliderState) {
  if (!genAI || isApiDown) {
    return generateLocalFutures(sliderState);
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = `
      You are a "Carbon Futures Engine". Based on a user's lifestyle choices, generate three short outputs.
      
      Lifestyle parameters:
      - Diet: ${sliderState.diet}% Non-Vegetarian
      - Transport: ${sliderState.transport}% Car (rest is Metro/Bus)
      - AC Usage: ${sliderState.ac} hours/day
      - Food Delivery: ${sliderState.foodDelivery} times/month
      
      Respond STRICTLY with a valid JSON object matching this exact schema:
      {
        "futureLetter": "A 3-sentence letter from their 2050 self written in second person.",
        "cityImpact": "A 1-paragraph consequence if everyone in their city lived like this.",
        "treeStat": "Start with a plain number then explain — e.g. '42 mature trees needed per year to offset your lifestyle.'",
        "imagePrompt": "A wildly dynamic, descriptive image prompt showing a city in 2050. CRITICAL: Visually incorporate all 4 categories (Diet, Transport, AC, Delivery). For example: 'A city with massive smog clouds from cars, towering air conditioning units on every window, swarms of food delivery drones blocking the sun, and huge factory farms' or 'A bright green utopia with electric bicycles, rooftop community gardens, natural wind ventilation buildings, and clear skies'. MUST CHANGE significantly based on the exact input values. Photorealistic, 8k."
      }
      Do not include any markdown formatting like \`\`\`json. Just return the raw JSON object.
    `;

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API Timeout')), 10000))
    ]);
    const responseText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini Futures Error:', error);
    if (shouldTripCircuitBreaker(error)) {
      isApiDown = true;
      console.warn('Gemini quota exhausted — falling back to local engine for this session.');
    } else {
      console.warn('Transient Gemini error — will retry on next call.', error.message);
    }
    return generateLocalFutures(sliderState);
  }
}
