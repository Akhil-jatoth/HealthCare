import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  EN: {
    // Brand & Nav
    brandName: "Swasthya",
    brandNameSub: "Saathi",
    brandTagline: "AI Rural Health Net",
    navHome: "Home",
    navSymptomChecker: "AI Symptom Checker",
    navFindDoctors: "Find Doctors",
    navAppointments: "Appointments",
    navDoctorPortal: "Doctor Portal",
    navMedicines: "Medicines",
    navEHR: "EHR",
    navSOS: "SOS",
    navDemoLogin: "⚡ Demo Login",
    navLoggedAsDoctor: "Doctor",
    navLoggedAsPatient: "Patient",
    navLogout: "Switch / Log Out",

    // Hero Section
    heroBadge: "🏆 Hackathon Innovation • Ayushman Bharat Aligned",
    heroTitlePrefix: "Smart Healthcare for ",
    heroTitleHighlight: "Rural & Remote",
    heroTitleSuffix: " Communities",
    heroSubtitle: "Bridging the healthcare divide with AI-assisted triage, instant verified doctor teleconsultations, bilingual medicine management, and digital health records.",
    heroBtnDoctors: "🩺 Browse & Book Doctors ➜",
    heroBtnDemo: "⚡ Instant 1-Click Demo Login",

    // Stats
    statSpecialistsNum: "14+",
    statSpecialistsLabel: "Verified Specialists",
    statConnectNum: "< 60s",
    statConnectLabel: "Instant Video Connect",
    statTriageNum: "100%",
    statTriageLabel: "Free Triage & SOS",
    statLanguagesNum: "4+",
    statLanguagesLabel: "Regional Languages",

    // Triage Section
    triageTitle: "AI Symptom Assistant & Triage",
    triageSubtitle: "Type your symptoms or select a quick rural health scenario",
    triagePlaceholder: "e.g. High fever for 2 days, severe headache and body pain...",
    triageBtnAnalyze: "Analyze Symptoms ⚡",
    triageBtnAnalyzing: "Analyzing...",
    triageQuickTitle: "Try Quick Scenarios:",
    triageCompleted: "✓ AI Analysis Complete",
    triagePriority: "Priority:",
    triageRecommended: "Recommended Specialist:",
    triageFindDoctor: "Find Specialist Now ➜",

    // Quick Symptoms & Advice
    symptom1_label: "High Fever & Chills",
    symptom1_spec: "General Physician / Internal Medicine",
    symptom1_advice: "Check for viral infection or malaria. Hydrate well and consult a general physician.",

    symptom2_label: "Chest Discomfort",
    symptom2_spec: "Cardiologist",
    symptom2_advice: "High priority: Rest immediately. Avoid exertion and consult a cardiologist for ECG review.",

    symptom3_label: "Child Persistent Cough",
    symptom3_spec: "Pediatrician",
    symptom3_advice: "Ensure adequate fluid intake and consult a pediatrician promptly to check respiratory airways.",

    symptom4_label: "Skin Rash & Itching",
    symptom4_spec: "Dermatologist",
    symptom4_advice: "Avoid scratching. Consult a dermatologist for topical soothing and anti-allergen treatment.",

    symptom5_label: "Joint & Knee Pain",
    symptom5_spec: "Orthopedic",
    symptom5_advice: "Avoid heavy weight loading. Consult an orthopedic specialist for assessment and mobility guidance.",

    // Role Gateways
    gatewaysTitle: "Select Your Healthcare Path",
    
    // Patient Portal Card
    patientBadge: "For Citizens & Patients",
    patientTitle: "Patient Portal",
    patientDesc: "Connect with certified doctors, get AI prescriptions, receive audio medicine reminders, and keep your rural health history unified.",
    patientFeature1: "Instant Tele-consultations with video link",
    patientFeature2: "AI Medicine Reminders & Dosage Alerts",
    patientFeature3: "Secure Health Records & Digital Prescriptions",
    patientBtnRegister: "Register as Patient",
    patientBtnDashboard: "My Patient Dashboard",

    // Doctor Portal Card
    doctorBadge: "For Medical Practitioners",
    doctorTitle: "Doctor Portal",
    doctorDesc: "Deliver care to remote underserved villages. Manage patient appointments, set flexible consultation slots, and review medical history.",
    doctorFeature1: "Tele-OPD Queue & Status Management",
    doctorFeature2: "Interactive Slot & Availability Controller",
    doctorFeature3: "Verified Digital Badging & Fee Settings",
    doctorBtnRegister: "Register as Doctor",
    doctorBtnDashboard: "Doctor Portal Dashboard",

    // Highlights
    highlightsTitle: "Built for Rural Realities",
    feature1Title: "Low-Bandwidth Resilient",
    feature1Desc: "Optimized for 2G/3G rural networks with offline data caching and fast responsive interfaces.",
    feature2Title: "Multilingual & Audio-Assisted",
    feature2Desc: "Voice-friendly UI with regional language translations in Hindi, Telugu, and Tamil for high rural literacy adoption.",
    feature3Title: "Integrated Micro-Payments",
    feature3Desc: "Seamless Razorpay integration with support for UPI, QR codes, and subsidized rural consultation vouchers.",
    feature4Title: "1-Click Emergency SOS",
    feature4Desc: "Instant ambulance dispatch, PHC alerts, and emergency helpline routing with real-time GPS telemetry.",

    // Emergency SOS Modal
    sosTitle: "🚨 Rural Emergency SOS Activated",
    sosMessage: "Priority emergency alert triggered. Nearest primary health center (PHC) and community health worker (ASHA) are being notified.",
    sosCallBtn: "Call 108 Ambulance",
    sosCloseBtn: "Close Alert",
    sosNationalAmb: "National Ambulance",
    sosMentalHealth: "Tele-MANAS Mental Health",
    sosRuralHotline: "Rural Health Hotline",
    sosGPS: "GPS Location"
  },

  HI: {
    // Brand & Nav
    brandName: "स्वास्थ्य",
    brandNameSub: "साथी",
    brandTagline: "एआई ग्रामीण स्वास्थ्य नेटवर्क",
    navHome: "होम",
    navSymptomChecker: "एआई लक्षण जांचकर्ता",
    navFindDoctors: "डॉक्टर खोजें",
    navAppointments: "अपॉइंटमेंट्स",
    navDoctorPortal: "डॉक्टर पोर्टल",
    navMedicines: "दवाइयां",
    navEHR: "स्वास्थ्य रिकॉर्ड",
    navSOS: "आपातकालीन SOS",
    navDemoLogin: "⚡ डेमो लॉगिन",
    navLoggedAsDoctor: "डॉक्टर",
    navLoggedAsPatient: "मरीज़",
    navLogout: "लॉग आउट / बदलें",

    // Hero Section
    heroBadge: "🏆 हैकाथॉन नवाचार • आयुष्मान भारत समर्थित",
    heroTitlePrefix: "ग्रामीण और दूरदराज क्षेत्रों के लिए ",
    heroTitleHighlight: "स्मार्ट स्वास्थ्य सेवा",
    heroTitleSuffix: "",
    heroSubtitle: "एआई आधारित लक्षण जांच, तत्काल प्रमाणित डॉक्टर टेली-परामर्श, द्विभाषी दवा प्रबंधन और डिजिटल स्वास्थ्य रिकॉर्ड के साथ ग्रामीण स्वास्थ्य को सशक्त बनाना।",
    heroBtnDoctors: "🩺 डॉक्टर खोजें और बुक करें ➜",
    heroBtnDemo: "⚡ 1-क्लिक डेमो लॉगिन",

    // Stats
    statSpecialistsNum: "14+",
    statSpecialistsLabel: "प्रमाणित विशेषज्ञ डॉक्टर",
    statConnectNum: "< 60 से",
    statConnectLabel: "त्वरित वीडियो परामर्श",
    statTriageNum: "100%",
    statTriageLabel: "मुफ्त लक्षण जांच और SOS",
    statLanguagesNum: "4+",
    statLanguagesLabel: "क्षेत्रीय भाषाएं",

    // Triage Section
    triageTitle: "एआई लक्षण सहायक और ट्राइएज",
    triageSubtitle: "अपने लक्षण लिखें या नीचे दिए गए त्वरित विकल्पों में से चुनें",
    triagePlaceholder: "जैसे: 2 दिन से तेज बुखार, सिरदर्द और बदन दर्द...",
    triageBtnAnalyze: "लक्षणों का विश्लेषण करें ⚡",
    triageBtnAnalyzing: "विश्लेषण जारी है...",
    triageQuickTitle: "त्वरित लक्षण चुनें:",
    triageCompleted: "✓ एआई विश्लेषण पूर्ण",
    triagePriority: "प्राथमिकता:",
    triageRecommended: "अनुशंसित विशेषज्ञ:",
    triageFindDoctor: "विशेषज्ञ डॉक्टर खोजें ➜",

    // Quick Symptoms & Advice
    symptom1_label: "तेज बुखार और कंपकंपी",
    symptom1_spec: "जनरल फिजिशियन / आंतरिक चिकित्सा",
    symptom1_advice: "वायरल संक्रमण या मलेरिया की जांच कराएं। पर्याप्त पानी पिएं और तुरंत जनरल फिजिशियन से परामर्श लें।",

    symptom2_label: "सीने में बेचैनी / दर्द",
    symptom2_spec: "हृदय रोग विशेषज्ञ (कार्डियोलॉजिस्ट)",
    symptom2_advice: "अति आवश्यक: तुरंत आराम करें। मेहनत वाला काम न करें और ईसीजी जांच के लिए हृदय रोग विशेषज्ञ से मिलें।",

    symptom3_label: "बच्चों में लगातार खांसी",
    symptom3_spec: "बाल रोग विशेषज्ञ (पीडियाट्रिशियन)",
    symptom3_advice: "बच्चे को पर्याप्त तरल पदार्थ दें और फेफड़ों की जांच के लिए तुरंत बाल रोग विशेषज्ञ से मिलें।",

    symptom4_label: "त्वचा पर दाने और खुजली",
    symptom4_spec: "त्वचा रोग विशेषज्ञ (डर्मेटोलॉजिस्ट)",
    symptom4_advice: "खुजली करने से बचें। एलर्जी रोधी उपचार और मरहम के लिए त्वचा विशेषज्ञ से परामर्श लें।",

    symptom5_label: "जोड़ों और घुटनों का दर्द",
    symptom5_spec: "हड्डी रोग विशेषज्ञ (ऑर्थोपेडिक)",
    symptom5_advice: "भारी वजन उठाने से बचें। जोड़ों की स्थिति और उपचार के लिए हड्डी रोग विशेषज्ञ से संपर्क करें।",

    // Role Gateways
    gatewaysTitle: "अपनी स्वास्थ्य सेवा का विकल्प चुनें",

    // Patient Portal Card
    patientBadge: "नागरिकों और मरीजों के लिए",
    patientTitle: "मरीज़ पोर्टल (Patient Portal)",
    patientDesc: "सत्यापित डॉक्टरों से जुड़ें, एआई प्रिस्क्रिप्शन प्राप्त करें, ऑडियो दवा रिमाइंडर पाएं और अपने पूरे स्वास्थ्य रिकॉर्ड को सुरक्षित रखें।",
    patientFeature1: "वीडियो लिंक के साथ तत्काल टेली-परामर्श",
    patientFeature2: "एआई दवा रिमाइंडर और खुराक की चेतावनी",
    patientFeature3: "सुरक्षित स्वास्थ्य रिकॉर्ड और डिजिटल पर्ची",
    patientBtnRegister: "मरीज़ के रूप में रजिस्टर करें",
    patientBtnDashboard: "मेरा मरीज़ डैशबोर्ड",

    // Doctor Portal Card
    doctorBadge: "चिकित्सकों और डॉक्टरों के लिए",
    doctorTitle: "डॉक्टर पोर्टल (Doctor Portal)",
    doctorDesc: "दूरदराज के ग्रामीण क्षेत्रों में उत्कृष्ट स्वास्थ्य सेवा प्रदान करें। अपॉइंटमेंट्स प्रबंधित करें और परामर्श समय निर्धारित करें।",
    doctorFeature1: "टेली-ओपीडी कतार और स्थिति प्रबंधन",
    doctorFeature2: "इंटरैक्टिव स्लॉट और उपलब्धता नियंत्रक",
    doctorFeature3: "सत्यापित डिजिटल बैज और परामर्श शुल्क",
    doctorBtnRegister: "डॉक्टर के रूप में रजिस्टर करें",
    doctorBtnDashboard: "डॉक्टर पोर्टल डैशबोर्ड",

    // Highlights
    highlightsTitle: "ग्रामीण आवश्यकताओं के अनुरूप निर्मित",
    feature1Title: "धीमे इंटरनेट पर भी सुचारू",
    feature1Desc: "2जी/3जी ग्रामीण नेटवर्क के लिए अनुकूलित, ऑफलाइन डेटा समर्थन और तेज इंटरफ़ेस।",
    feature2Title: "बहुभाषी और ऑडियो सहायता",
    feature2Desc: "हिंदी, तेलुगु और तमिल में पूर्ण अनुवाद के साथ ग्रामीण नागरिकों के लिए अनुकूल आवाज सहायता।",
    feature3Title: "एकीकृत डिजिटल भुगतान",
    feature3Desc: "यूपीआई, क्यूआर कोड और रियायती ग्रामीण वाउचर के साथ रेज़रपे का सुरक्षित एकीकरण।",
    feature4Title: "1-क्लिक आपातकालीन SOS",
    feature4Desc: "तत्काल एम्बुलेंस सहायता, प्राथमिक स्वास्थ्य केंद्र अलर्ट और जीपीएस टेलीमेट्री सेवा।",

    // Emergency SOS Modal
    sosTitle: "🚨 ग्रामीण आपातकालीन SOS सक्रिय",
    sosMessage: "आपातकालीन अलर्ट शुरू हो गया है। नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) और आशा कार्यकर्ता को सूचित किया जा रहा है।",
    sosCallBtn: "108 एम्बुलेंस को कॉल करें",
    sosCloseBtn: "अलर्ट बंद करें",
    sosNationalAmb: "राष्ट्रीय एम्बुलेंस",
    sosMentalHealth: "टेली-मानस मानसिक स्वास्थ्य",
    sosRuralHotline: "ग्रामीण स्वास्थ्य हेल्पलाइन",
    sosGPS: "जीपीएस लोकेशन"
  },

  TE: {
    // Brand & Nav
    brandName: "స్వాస్థ్య",
    brandNameSub: "సాథీ",
    brandTagline: "గ్రామీణ ఏఐ హెల్త్ నెట్‌వర్క్",
    navHome: "హోమ్",
    navSymptomChecker: "ఏఐ లక్షణాల తనిఖీ",
    navFindDoctors: "వైద్యులను కనుగొనండి",
    navAppointments: "అపాయింట్‌మెంట్‌లు",
    navDoctorPortal: "డాక్టర్ పోర్టల్",
    navMedicines: "మందులు",
    navEHR: "ఆరోగ్య రికార్డులు",
    navSOS: "అత్యవసర SOS",
    navDemoLogin: "⚡ డెమో లాగిన్",
    navLoggedAsDoctor: "వైద్యుడు",
    navLoggedAsPatient: "రోగి",
    navLogout: "లాగౌట్ / మార్చండి",

    // Hero Section
    heroBadge: "🏆 హ్యాకథాన్ ఆవిష్కరణ • ఆయుష్మాన్ భారత్ ఆధారితం",
    heroTitlePrefix: "గ్రామీణ & మారుమూల ప్రాంతాలకు ",
    heroTitleHighlight: "స్మార్ట్ వైద్య సంరక్షణ",
    heroTitleSuffix: "",
    heroSubtitle: "ఏఐ లక్షణాల విశ్లేషణ, నిపుణులైన వైద్యులతో తక్షణ వీడియో సంప్రదింపులు, మందుల రిమైండర్‌లు మరియు డిజిటల్ ఆరోగ్య రికార్డులతో గ్రామీణ ఆరోగ్యాన్ని మెరుగుపరుస్తున్నాము.",
    heroBtnDoctors: "🩺 వైద్యులను కనుగొని బుక్ చేయండి ➜",
    heroBtnDemo: "⚡ 1-క్లిక్ డెమో లాగిన్",

    // Stats
    statSpecialistsNum: "14+",
    statSpecialistsLabel: "ధృవీకరించబడిన నిపుణులు",
    statConnectNum: "< 60 సె",
    statConnectLabel: "తక్షణ వీడియో సంప్రదింపు",
    statTriageNum: "100%",
    statTriageLabel: "ఉచిత ఏఐ తనిఖీ & SOS",
    statLanguagesNum: "4+",
    statLanguagesLabel: "ప్రాంతీయ భాషలు",

    // Triage Section
    triageTitle: "ఏఐ రోగ లక్షణ సహాయకుడు & ట్రయేజ్",
    triageSubtitle: "మీ లక్షణాలను టైప్ చేయండి లేదా క్రింది ఎంపికలలో ఒకదాన్ని ఎంచుకోండి",
    triagePlaceholder: "ఉదా: 2 రోజులుగా తీవ్ర జ్వరం, తలనొప్పి మరియు ఒంటి నొప్పులు...",
    triageBtnAnalyze: "లక్షణాలను విశ్లేషించండి ⚡",
    triageBtnAnalyzing: "విశ్లేషిస్తోంది...",
    triageQuickTitle: "త్వరిత లక్షణాలు:",
    triageCompleted: "✓ ఏఐ విశ్లేషణ పూర్తయింది",
    triagePriority: "ప్రాధాన్యత:",
    triageRecommended: "సిఫార్సు చేసిన నిపుణుడు:",
    triageFindDoctor: "వైద్యుడిని సంప్రదించండి ➜",

    // Quick Symptoms & Advice
    symptom1_label: "తీవ్రమైన జ్వరం మరియు చలి",
    symptom1_spec: "జనరల్ ఫిజీషియన్ / ఇంటర్నల్ మెడిసిన్",
    symptom1_advice: "వైరల్ ఇన్ఫెక్షన్ లేదా మలేరియా పరీక్ష చేయించుకోండి. పుష్కలంగా నీరు త్రాగండి మరియు జనరల్ ఫిజీషియన్‌ను సంప్రదించండి.",

    symptom2_label: "ఛాతీలో అసౌకర్యం / నొప్పి",
    symptom2_spec: "కార్డియాలజిస్ట్ (గుండె నిపుణుడు)",
    symptom2_advice: "అత్యవసరం: వెంటనే విశ్రాంతి తీసుకోండి. బరువైన పనులు మానుకోండి మరియు ECG పరీక్ష కోసం కార్డియాలజిస్ట్‌ను కలవండి.",

    symptom3_label: "పిల్లలలో నిరంతర దగ్గు",
    symptom3_spec: "పీడియాట్రీషియన్ (పిల్లల వైద్యుడు)",
    symptom3_advice: "పిల్లలకు సరిపడా ద్రవాలు ఇవ్వండి మరియు శ్వాసకోశ పరీక్ష కోసం పిల్లల నిపుణుడిని సంప్రదించండి.",

    symptom4_label: "చర్మంపై దద్దుర్లు మరియు దురద",
    symptom4_spec: "డెర్మటాలజిస్ట్ (చర్మ నిపుణుడు)",
    symptom4_advice: "గోకడం మానుకోండి. అలెర్జీ నివారణ మరియు లేపనాల కోసం చర్మ నిపుణుడిని సంప్రదించండి.",

    symptom5_label: "కీళ్ళు మరియు మోకాళ్ళ నొప్పులు",
    symptom5_spec: "ఆర్థోపెడిక్ (ఎముకల నిపుణుడు)",
    symptom5_advice: "బరువులు ఎత్తడం మానుకోండి. కీళ్ళ పరీక్ష మరియు చికిత్స కోసం ఎముకల వైద్యుడిని సంప్రదించండి.",

    // Role Gateways
    gatewaysTitle: "మీ ఆరోగ్య విభాగాన్ని ఎంచుకోండి",

    // Patient Portal Card
    patientBadge: "పౌరులు & రోగుల కోసం",
    patientTitle: "రోగి పోర్టల్ (Patient Portal)",
    patientDesc: "అనుభవజ్ఞులైన వైద్యులతో మాట్లాడండి, ఏఐ ప్రిస్క్రిప్షన్లు పొందండి, వాయిస్ మందుల రిమైండర్‌లు మరియు డిజిటల్ ఆరోగ్య రికార్డులను భద్రపరుచుకోండి.",
    patientFeature1: "వీడియో లింక్‌తో తక్షణ టెలి-సంప్రదింపులు",
    patientFeature2: "ఏఐ మందుల రిమైండర్‌లు & మోతాదు హెచ్చరికలు",
    patientFeature3: "సురక్షిత ఆరోగ్య రికార్డులు & డిజిటల్ ప్రిస్క్రిప్షన్లు",
    patientBtnRegister: "రోగిగా నమోదు చేసుకోండి",
    patientBtnDashboard: "నా పేషెంట్ డాష్‌బోర్డ్",

    // Doctor Portal Card
    doctorBadge: "వైద్య నిపుణుల కోసం",
    doctorTitle: "డాక్టర్ పోర్టల్ (Doctor Portal)",
    doctorDesc: "మారుమూల గ్రామీణ ప్రాంత ప్రజలకు విశిష్ట వైద్య సేవలను అందించండి. రోగి అపాయింట్‌మెంట్‌లను నిర్వహించండి.",
    doctorFeature1: "టెలి-OPD క్యూ & స్థితి నిర్వహణ",
    doctorFeature2: "ఇంటరాక్టివ్ స్లాట్ & సమయ నియంత్రణ",
    doctorFeature3: "ధృవీకరించబడిన డిజిటల్ బ్యాడ్జ్ & ఫీజు సెట్టింగ్స్",
    doctorBtnRegister: "వైద్యుడిగా నమోదు చేసుకోండి",
    doctorBtnDashboard: "డాక్టర్ పోర్టల్ డాష్‌బోర్డ్",

    // Highlights
    highlightsTitle: "గ్రామీణ పరిస్థితులకు అనుగుణంగా రూపొందించబడింది",
    feature1Title: "తక్కువ నెట్‌వర్క్‌లోనూ వేగవంతం",
    feature1Desc: "2G/3G గ్రామీణ నెట్‌వర్క్‌ల కోసం ఆప్టిమైజ్ చేయబడింది, ఆఫ్‌లైన్ డేటా సదుపాయం.",
    feature2Title: "బహుభాషా & ఆడియో సహాయం",
    feature2Desc: "తెలుగు, హిందీ మరియు తమిళ భాషలలో సంపూర్ణ అనువాదంతో సులభమైన వాయిస్ ఇంటర్‌ఫేస్.",
    feature3Title: "సులభమైన మైక్రో-చెల్లింపులు",
    feature3Desc: "UPI, QR కోడ్‌లు మరియు సబ్సిడీ గ్రామీణ వోచర్‌లతో Razorpay సురక్షిత చెల్లింపులు.",
    feature4Title: "1-క్లిక్ ఎమర్జెన్సీ SOS",
    feature4Desc: "తక్షణ అంబులెన్స్ సహాయం, ప్రాథమిక ఆరోగ్య కేంద్ర హెచ్చరికలు మరియు GPS ట్రాకింగ్.",

    // Emergency SOS Modal
    sosTitle: "🚨 గ్రామీణ అత్యవసర SOS యాక్టివేట్ చేయబడింది",
    sosMessage: "అత్యవసర హెచ్చరిక పంపబడింది. సమీపంలోని ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) మరియు ఆశా కార్యకర్తకు సమాచారం అందుతోంది.",
    sosCallBtn: "108 అంబులెన్స్‌కు కాల్ చేయండి",
    sosCloseBtn: "హెచ్చరికను మూసివేయండి",
    sosNationalAmb: "జాతీయ అంబులెన్స్",
    sosMentalHealth: "టెలి-మానస్ మానసిక ఆరోగ్యం",
    sosRuralHotline: "గ్రామీణ ఆరోగ్య హెల్ప్‌లైన్",
    sosGPS: "GPS లొకేషన్"
  },

  TA: {
    // Brand & Nav
    brandName: "சுவஸ்த்யா",
    brandNameSub: "சாதி",
    brandTagline: "AI கிராமப்புற சுகாதார வலையமைப்பு",
    navHome: "முகப்பு",
    navSymptomChecker: "AI அறிகுறி சரிபார்ப்பு",
    navFindDoctors: "மருத்துவரைத் தேடுங்கள்",
    navAppointments: "முன்பதிவுகள்",
    navDoctorPortal: "மருத்துவர் தளம்",
    navMedicines: "மருந்துகள்",
    navEHR: "சுகாதார ஆவணங்கள்",
    navSOS: "அவசர SOS",
    navDemoLogin: "⚡ டெமோ உள்நுழைவு",
    navLoggedAsDoctor: "மருத்துவர்",
    navLoggedAsPatient: "நோயாளி",
    navLogout: "வெளியேறு / மாற்று",

    // Hero Section
    heroBadge: "🏆 ஹேக்கத்தான் புதுமை • ஆயுஷ்மான் பாரத் ஆதரவு",
    heroTitlePrefix: "கிராமப்புற & தொலைதூர பகுதிகளுக்கான ",
    heroTitleHighlight: "ஸ்மார்ட் சுகாதார சேவை",
    heroTitleSuffix: "",
    heroSubtitle: "AI அறிகுறி ஆய்வு, உடனடி வீடியோ மருத்துவ ஆலோசனை, இருமொழி மருந்து நினைவூட்டல்கள் மற்றும் டிஜிட்டல் மருத்துவ ஆவணங்களுடன் கிராமப்புற சுகாதாரத்தை மேம்படுத்துகிறோம்.",
    heroBtnDoctors: "🩺 மருத்துவர்களைத் தேடி முன்பதிவு செய்யுங்கள் ➜",
    heroBtnDemo: "⚡ 1-கிளிக் டெமோ உள்நுழைவு",

    // Stats
    statSpecialistsNum: "14+",
    statSpecialistsLabel: "சான்றளிக்கப்பட்ட நிபுணர்கள்",
    statConnectNum: "< 60 வி",
    statConnectLabel: "உடனடி வீடியோ தொடர்பு",
    statTriageNum: "100%",
    statTriageLabel: "இலவச AI பரிசோதனை & SOS",
    statLanguagesNum: "4+",
    statLanguagesLabel: "பிராந்திய மொழிகள்",

    // Triage Section
    triageTitle: "AI அறிகுறி உதவியாளர் & வழிகாட்டி",
    triageSubtitle: "உங்கள் அறிகுறிகளைத் தட்டச்சு செய்யவும் அல்லது கீழேயுள்ள விருப்பங்களைத் தேர்ந்தெடுக்கவும்",
    triagePlaceholder: "எ.கா: 2 நாட்களாக கடுமையான காய்ச்சல், தலைவலி மற்றும் உடல் வலி...",
    triageBtnAnalyze: "அறிகுறிகளை ஆய்வு செய் ⚡",
    triageBtnAnalyzing: "ஆய்வு செய்கிறது...",
    triageQuickTitle: "விரைவு அறிகுறிகள்:",
    triageCompleted: "✓ AI ஆய்வு நிறைவுற்றது",
    triagePriority: "முன்னுரிமை:",
    triageRecommended: "பரிந்துரைக்கப்பட்ட நிபுணர்:",
    triageFindDoctor: "மருத்துவரை அணுகவும் ➜",

    // Quick Symptoms & Advice
    symptom1_label: "அதிதீவிர காய்ச்சல் மற்றும் நடுக்கம்",
    symptom1_spec: "பொது மருத்துவர் / உள் மருத்துவம்",
    symptom1_advice: "வைரஸ் தொற்று அல்லது மலேரியா பரிசோதனை செய்யவும். நிறைய தண்ணீர் குடித்து பொது மருத்துவரை அணுகவும்.",

    symptom2_label: "நெஞ்சு அசௌகரியம் / வலி",
    symptom2_spec: "இதய நிபுணர் (கார்டியாலஜிஸ்ட்)",
    symptom2_advice: "அவசரம்: உடனடியாக ஓய்வெடுக்கவும். கடின உழைப்பைத் தவிர்த்து ECG பரிசோதனைக்கு இதய மருத்துவரை அணுகவும்.",

    symptom3_label: "குழந்தைகளுக்கு தொடர் இருமல்",
    symptom3_spec: "குழந்தை நல மருத்துவர் (பீடியாட்ரிசியன்)",
    symptom3_advice: "குழந்தைக்கு போதுமான திரவங்களை வழங்கி உடனடியாக குழந்தை மருத்துவரிடம் பரிசோதிக்கவும்.",

    symptom4_label: "தோல் தடிப்பு மற்றும் அரிப்பு",
    symptom4_spec: "தோல் நோய் நிபுணர் (டெர்மட்டாலஜிஸ்ட்)",
    symptom4_advice: "சொறிவதைத் தவிர்க்கவும். ஒவ்வாமை எதிர்ப்பு சிகிச்சைக்காக தோல் மருத்துவரை அணுகவும்.",

    symptom5_label: "மூட்டு மற்றும் முழங்கால் வலி",
    symptom5_spec: "எலும்பு முறிவு நிபுணர் (ஆர்த்தோபெடிக்)",
    symptom5_advice: "அதிக எடையைத் தூக்குவதைத் தவிர்க்கவும். மூட்டு பரிசோதனைக்கு எலும்பு மருத்துவரை அணுகவும்.",

    // Role Gateways
    gatewaysTitle: "உங்கள் சுகாதாரப் பிரிவைத் தேர்ந்தெடுக்கவும்",

    // Patient Portal Card
    patientBadge: "பொதுமக்கள் மற்றும் நோயாளிகளுக்கு",
    patientTitle: "நோயாளி தளம் (Patient Portal)",
    patientDesc: "மருத்துவர்களுடன் இணையுங்கள், AI பரிந்துரைகளைப் பெறுங்கள், ஆடியோ மருந்து நினைவூட்டல்கள் மற்றும் டிஜிட்டல் பதிவுகளைப் பராமரியுங்கள்.",
    patientFeature1: "வீடியோ இணைப்புடன் உடனடி மருத்துவ ஆலோசனை",
    patientFeature2: "AI மருந்து நினைவூட்டல் & அளவு எச்சரிக்கைகள்",
    patientFeature3: "பாதுகாப்பான சுகாதார ஆவணங்கள் & டிஜிட்டல் மருந்துச்சீட்டு",
    patientBtnRegister: "நோயாளியாகப் பதிவு செய்யுங்கள்",
    patientBtnDashboard: "எனது நோயாளி பலகை",

    // Doctor Portal Card
    doctorBadge: "மருத்துவ நிபுணர்களுக்கு",
    doctorTitle: "மருத்துவர் தளம் (Doctor Portal)",
    doctorDesc: "தொலைதூர கிராமப்புற மக்களுக்கு உயர்தர மருத்துவ சேவையை வழங்குங்கள். முன்பதிவுகளை எளிதாக நிர்வகியுங்கள்.",
    doctorFeature1: "டெலி-OPD வரிசை & நிலை மேலாண்மை",
    doctorFeature2: "நேர ஒதுக்கீடு & கிடைக்கும் தன்மை கட்டுப்படுத்தி",
    doctorFeature3: "சான்றளிக்கப்பட்ட டிஜிட்டல் பேட்ஜ் & கட்டண அமைப்புகள்",
    doctorBtnRegister: "மருத்துவராகப் பதிவு செய்யுங்கள்",
    doctorBtnDashboard: "மருத்துவர் தள பலகை",

    // Highlights
    highlightsTitle: "கிராமப்புற தேவைகளுக்காக உருவாக்கப்பட்டது",
    feature1Title: "குறைந்த இணையத்திலும் விரைவானது",
    feature1Desc: "2G/3G கிராமப்புற நெட்வொர்க்குகளுக்கு உகந்தது, ஆஃப்லைன் தரவு வசதி.",
    feature2Title: "பன்மொழி & ஆடியோ உதவி",
    feature2Desc: "தமிழ், இந்தி மற்றும் தெலுங்கு மொழிகளில் முழுமையான மொழிபெயர்ப்புடன் கூடிய குரல் உதவி.",
    feature3Title: "எளிதான டிஜிட்டல் கட்டணம்",
    feature3Desc: "UPI, QR குறியீடுகள் மற்றும் மானிய கிராமப்புற வவுச்சர்களுடன் Razorpay பாதுகாப்பான கட்டணம்.",
    feature4Title: "1-கிளிக் அவசர SOS",
    feature4Desc: "உடனடி ஆம்புலன்ஸ் உதவி, ஆரம்ப சுகாதார நிலைய எச்சரிக்கைகள் மற்றும் GPS கண்காணிப்பு.",

    // Emergency SOS Modal
    sosTitle: "🚨 கிராமப்புற அவசர SOS இயக்கப்பட்டது",
    sosMessage: "அவசர எச்சரிக்கை அனுப்பப்பட்டுள்ளது. அருகிலுள்ள ஆரம்ப சுகாதார நிலையம் (PHC) மற்றும் ஆஷா பணியாளருக்குத் தெரிவிக்கப்படுகிறது.",
    sosCallBtn: "108 ஆம்புலன்ஸை அழைக்கவும்",
    sosCloseBtn: "எச்சரிக்கையை மூடு",
    sosNationalAmb: "தேசிய ஆம்புலன்ஸ்",
    sosMentalHealth: "டெலி-மானாஸ் மனநலம்",
    sosRuralHotline: "கிராமப்புற சுகாதார உதவி எண்",
    sosGPS: "GPS இருப்பிடம்"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("appLanguage") || "EN";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("appLanguage", lang);
    window.dispatchEvent(new Event("languagechange"));
  };

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("appLanguage");
      if (stored && stored !== language) {
        setLanguageState(stored);
      }
    };
    window.addEventListener("languagechange", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("languagechange", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, [language]);

  const t = (key, fallback = "") => {
    const langDict = translations[language] || translations.EN;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = translations.EN;
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "EN",
      setLanguage: () => {},
      t: (k, fb) => fb || k,
    };
  }
  return context;
};
