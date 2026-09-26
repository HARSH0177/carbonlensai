import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackResult, generateLocalFutures } from './carbon-engine';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const PROXY_URL = import.meta.env.VITE_PROXY_API_URL || import.meta.env.VITE_CLOUD_FUNCTION_URL;
let genAI = null;

// Stateful Circuit Breaker with Half-Open probe
let isApiDown = false;
let apiDownSince = null;
const COOLDOWN_MS = 5 * 60 * 1000; // 5 min half-open retry window

export function shouldAttemptLiveCall() {
  if (!isApiDown) return true;
  if (Date.now() - apiDownSince > COOLDOWN_MS) {
    // Half-open state: allow a single probe request through
    return true;
  }
  return false;
}

export function tripCircuit() {
  isApiDown = true;
  apiDownSince = Date.now();
  console.warn('Circuit breaker tripped: Gemini API marked down. Cooldown: 5 minutes.');
}

export function resetCircuit() {
  if (isApiDown) {
    console.info('Circuit breaker reset: Gemini API live call succeeded.');
  }
  isApiDown = false;
  apiDownSince = null;
}

// Model specification with centralized fallback chain
export const GEMINI_MODEL_CHAIN = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest'
];
export const GEMINI_MODEL = GEMINI_MODEL_CHAIN[0];

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Circuit breaker helper: only trip on rate limit (HTTP 429) or quota errors
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
  const hasLiveBackend = Boolean(PROXY_URL || genAI);
  if (!hasLiveBackend || !shouldAttemptLiveCall()) {
    console.warn('Gemini live backend unavailable or in circuit cooldown. Using deterministic offline category estimator.');
    return new Promise(resolve => setTimeout(() => resolve(getFallbackResult(scanType)), 400));
  }

  const executeCall = async () => {
    // Priority 1: Secure Server-Side Cloud Function Proxy (keeps API key off client)
    if (PROXY_URL) {
      const imagePart = await fileToGenerativePart(imageFile);
      const res = await fetch(`${PROXY_URL.replace(/\/$/, '')}/analyzeImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType,
          scanType: scanType || 'meal'
        })
      });
      if (!res.ok) {
        throw new Error(`Proxy error HTTP ${res.status}: ${await res.text()}`);
      }
      return await res.json();
    }

    // Priority 2: Direct Client Call with Multi-Model Fallback Chain
    const imagePart = await fileToGenerativePart(imageFile);
    let lastError = null;

    for (const modelName of GEMINI_MODEL_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await Promise.race([
          model.generateContent([prompt, imagePart]),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API Timeout')), 10000))
        ]);
        const responseText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
        return JSON.parse(responseText);
      } catch (err) {
        lastError = err;
        const isModelUnavailable = err?.status === 404 || err?.status === 503 || err?.message?.includes('404') || err?.message?.includes('503');
        if (isModelUnavailable) {
          console.warn(`Model ${modelName} returned ${err.status || err.message}, failing over to next model in chain...`);
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error('All Gemini model fallbacks exhausted');
  };

  try {
    const parsed = await executeCall();
    resetCircuit();
    return parsed;
  } catch (error) {

    console.error('Gemini API Error:', error);
    if (shouldTripCircuitBreaker(error)) {
      tripCircuit();
    } else {
      console.warn('Transient Gemini error — will retry on next call.', error.message);
    }
    return getFallbackResult(scanType);
  }
}

export async function generateFutures(sliderState) {
  // Input Validation and Sanitization (Security)
  const safeState = {
    diet: Math.min(Math.max(Number(sliderState.diet) || 50, 0), 100),
    transport: Math.min(Math.max(Number(sliderState.transport) || 50, 0), 100),
    ac: Math.min(Math.max(Number(sliderState.ac) || 4, 0), 24),
    foodDelivery: Math.min(Math.max(Number(sliderState.foodDelivery) || 5, 0), 100),
  };

  if (!genAI || !shouldAttemptLiveCall()) {
    return generateLocalFutures(safeState);
  }

  const prompt = `
      You are a "Carbon Futures Engine". Based on a user's lifestyle choices, generate three short outputs.
      
      Lifestyle parameters:
      - Diet: ${safeState.diet}% Non-Vegetarian
      - Transport: ${safeState.transport}% Car (rest is Metro/Bus)
      - AC Usage: ${safeState.ac} hours/day
      - Food Delivery: ${safeState.foodDelivery} times/month
      
      Respond STRICTLY with a valid JSON object matching this exact schema:
      {
        "futureLetter": "A 3-sentence letter from their 2050 self written in second person.",
        "cityImpact": "A 1-paragraph consequence if everyone in their city lived like this.",
        "treeStat": "Start with a plain number then explain — e.g. '42 mature trees needed per year to offset your lifestyle.'",
        "imagePrompt": "A wildly dynamic, descriptive image prompt showing a city in 2050. CRITICAL: Visually incorporate all 4 categories (Diet, Transport, AC, Delivery). For example: 'A city with massive smog clouds from cars, towering air conditioning units on every window, swarms of food delivery drones blocking the sun, and huge factory farms' or 'A bright green utopia with electric bicycles, rooftop community gardens, natural wind ventilation buildings, and clear skies'. MUST CHANGE significantly based on the exact input values. Photorealistic, 8k."
      }
      Do not include any markdown formatting like \`\`\`json. Just return the raw JSON object.
    `;

  try {
    let lastError = null;
    for (const modelName of GEMINI_MODEL_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API Timeout')), 10000))
        ]);
        const responseText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(responseText);
        resetCircuit();
        return parsed;
      } catch (error) {
        lastError = error;
        const isModelUnavailable = error?.status === 404 || error?.status === 503 || error?.message?.includes('404') || error?.message?.includes('503');
        if (isModelUnavailable) {
          console.warn(`Futures model ${modelName} returned ${error.status || error.message}, failing over to next model in chain...`);
          continue;
        }
        break; // Non-model-availability errors (e.g. rate limit, parse error) should not cycle through all models
      }
    }

    throw lastError || new Error('All Gemini model fallbacks exhausted');
  } catch (error) {
    console.error('Gemini Futures Error:', error);
    if (shouldTripCircuitBreaker(error)) {
      tripCircuit();
    } else {
      console.warn('Transient Gemini error — will retry on next call.', error.message);
    }
    return generateLocalFutures(safeState);
  }
}
