const { onRequest } = require('firebase-functions/v2/https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_MODEL_CHAIN = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest'
];

/**
 * Server-side proxy function for CarbonLens image analysis.
 * Secures GEMINI_API_KEY as a managed secret rather than bundling into client JavaScript.
 */
exports.analyzeImage = onRequest({
  cors: true,
  secrets: ['GEMINI_API_KEY'],
  maxInstances: 10,
  timeoutSeconds: 30
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { base64Data, mimeType, scanType } = req.body || {};

  if (!base64Data || !mimeType) {
    return res.status(400).json({ error: 'Missing base64Data or mimeType in request payload' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server secret GEMINI_API_KEY is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
      You are an expert carbon footprint estimator for the Indian context. 
      Analyze this image (type: ${scanType || 'meal'}). 
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

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    let lastError = null;
    for (const modelName of GEMINI_MODEL_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(responseText);
        return res.status(200).json(parsed);
      } catch (err) {
        lastError = err;
        const isModelUnavailable = err?.status === 404 || err?.status === 503 || err?.message?.includes('404') || err?.message?.includes('503');
        if (isModelUnavailable) {
          console.warn(`Cloud Function: Model ${modelName} returned ${err.status || err.message}, failing over to next model in chain...`);
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error('All Gemini model fallbacks exhausted in Cloud Function');
  } catch (err) {
    console.error('Error in analyzeImage Cloud Function:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});
