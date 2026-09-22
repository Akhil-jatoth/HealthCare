const symptomRules = [
  {
    symptoms: ["fever", "cough"],
    possibleConditions: [
      "Flu-like illness",
      "Respiratory infection",
    ],
  },

  {
    symptoms: ["fever", "body pain"],
    possibleConditions: [
      "Flu-like illness",
      "Viral infection",
    ],
  },

  {
    symptoms: ["fever", "cough", "sore throat"],
    possibleConditions: [
      "Respiratory infection",
      "Flu-like illness",
    ],
  },

  {
    symptoms: ["cough", "sore throat"],
    possibleConditions: [
      "Common cold",
      "Respiratory infection",
    ],
  },

  {
    symptoms: ["headache", "nausea"],
    possibleConditions: [
      "Migraine-like symptoms",
    ],
  },

  {
    symptoms: ["stomach pain", "vomiting"],
    possibleConditions: [
      "Gastrointestinal illness",
    ],
  },

  {
    symptoms: ["stomach pain", "diarrhea"],
    possibleConditions: [
      "Gastrointestinal illness",
    ],
  },
];

const emergencySymptoms = [
  "chest pain",
  "difficulty breathing",
  "severe difficulty breathing",
  "loss of consciousness",
  "fainting",
  "severe bleeding",
];

module.exports = {
  symptomRules,
  emergencySymptoms,
};