const { GoogleGenAI } = require("@google/genai");
const { symptomRules } = require("../data/symptomRules");

console.log(
  "Gemini API key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getRuleBasedResult = (symptoms, severity) => {
  const queryStr = symptoms.join(" ").toLowerCase();
  
  // Strict check: if input is clearly non-medical
  const nonMedicalKeywords = [
    "python", "javascript", "code", "programming", "cricket", "football",
    "movie", "song", "president", "prime minister", "weather forecast",
    "capital of", "who are you", "tell me a joke", "recipe", "stock market",
    "bitcoin", "crypto"
  ];
  
  const isNonMedical = nonMedicalKeywords.some(kw => queryStr.includes(kw));
  if (isNonMedical) {
    return {
      isOffTopic: true,
      possibleConditions: ["Non-Medical Query Detected"],
      urgency: "Low",
      recommendation: "I am Swasthya Saathi's dedicated Medical & Health Assistant. I am strictly specialized in health symptoms, clinical precautions, and doctor triage. Please ask only questions related to your medical symptoms or health doubts.",
      recommendedSpecialists: ["General Physician"],
    };
  }

  const matchedConditions = symptomRules
    .filter((rule) => rule.symptoms.every((symptom) => symptoms.includes(symptom)))
    .flatMap((rule) => rule.possibleConditions);

  const possibleConditions = [...new Set(matchedConditions)];
  const urgency = severity === "Severe"
    ? "High"
    : severity === "Moderate"
      ? "Moderate"
      : "Low";

  return {
    possibleConditions: possibleConditions.length
      ? possibleConditions
      : ["General Health Condition"],
    urgency,
    recommendation: severity === "Severe"
      ? "Please consult a qualified healthcare practitioner promptly."
      : "Monitor your symptoms and schedule a consultation with a specialist if symptoms persist.",
    recommendedSpecialists: ["General Physician"],
  };
};

const analyzeSymptoms = async (symptoms, duration, severity) => {
  if (!process.env.GEMINI_API_KEY) {
    return getRuleBasedResult(symptoms, severity);
  }

  try {
    const prompt = `
You are Swasthya Saathi's dedicated Medical and Healthcare Symptom Assistant.

STRICT DOMAIN CONSTRAINT:
You MUST answer ONLY about human medical symptoms, health doubts, physical ailments, clinical precautions, and triage.
If the user's query is about general knowledge, programming, sports, movies, politics, finance, entertainment, or anything outside human healthcare, you MUST refuse to answer off-topic queries and politely remind them that you only answer health & medical symptom doubts.

User reported:
Symptoms: ${symptoms.join(", ")}
Duration: ${duration}
Severity: ${severity}

Return ONLY a valid JSON object with exactly these fields:

{
  "isOffTopic": false,
  "possibleConditions": ["condition 1", "condition 2"],
  "urgency": "Low",
  "recommendation": "A clear clinical guidance recommendation for the user",
  "recommendedSpecialists": ["General Physician"]
}

If the user query is NOT about healthcare/symptoms:
Set "isOffTopic" to true, "possibleConditions" to ["Non-Medical Query"], "urgency" to "Low", "recommendation" to "I am Swasthya Saathi's dedicated Medical & Health Assistant. I can only assist with medical symptoms, health doubts, clinical precautions, and doctor triage. Please describe your health symptoms.", "recommendedSpecialists" to ["General Physician"].

If valid medical query:
"recommendedSpecialists" must be chosen from:
- General Physician
- Cardiology
- Dermatology
- Orthopedics
- ENT
- Ophthalmology
- Dentistry
- Pediatrics
- Psychiatry
- Gynecology

"urgency" must be exactly one of: Low, Moderate, High, Emergency.

Return ONLY raw JSON. No Markdown fences, no explanations.
`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
    } catch (e) {
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
    }

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const result = JSON.parse(text);

    if (!Array.isArray(result.possibleConditions) || !result.urgency || !result.recommendation) {
      throw new Error("Invalid response format from Gemini");
    }

    if (!Array.isArray(result.recommendedSpecialists) || result.recommendedSpecialists.length === 0) {
      result.recommendedSpecialists = ["General Physician"];
    }

    return result;
  } catch (error) {
    console.warn("Gemini unavailable or error; using rule-based symptom analysis:", error.message);
    return getRuleBasedResult(symptoms, severity);
  }
};

module.exports = {
  analyzeSymptoms,
};