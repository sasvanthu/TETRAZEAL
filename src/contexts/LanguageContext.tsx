import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    loans: 'Loan Management',
    training: 'Financial Literacy',
    tools: 'Smart Tools',
    'expense-tracker': 'Expense Tracker',
    'emi-calculator': 'EMI Calculator',
    'financial-score': 'Financial Score',
    analytics: 'Analytics',
    notifications: 'Notifications',
    schemes: 'Gov Schemes',
    documents: 'Documents',
    community: 'Community',
    'ai-advisor': 'AI Advisor',
    settings: 'Settings',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    view: 'View',
    close: 'Close',

    // Dashboard
    welcome: 'Welcome back',
    totalLoans: 'Total Loans',
    activeLoans: 'Active Loans',
    monthlyEMI: 'Monthly EMI',
    nextPayment: 'Next Payment',

    // Loan Management
    loanManagement: 'Loan Management',
    loanDescription: 'Calculate, compare, and manage your business loans.',
    addNewLoan: 'Apply for New Loan',
    loanEligibility: 'Loan Eligibility Checker',
    checkEligibility: 'Check Eligibility',
    applicationStatus: 'Loan Application Status',
    viewStatus: 'View Status',

    // Expense Tracker
    expenseTracker: 'Expense Tracker',
    trackExpenses: 'Track your weekly and monthly expenses',
    addExpense: 'Add Expense',
    totalExpenses: 'Total Expenses',
    weeklyExpenses: 'Weekly Expenses',
    monthlyExpenses: 'Monthly Expenses',
    expenseCategories: 'Expense Categories',

    // AI Advisor
    aiAdvisor: 'AI Financial Advisor',
    askAnything: 'Ask anything about your finances...',
    clearChat: 'Clear chat',

    // Settings
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    marathi: 'मराठी',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    loans: 'ऋण प्रबंधन',
    training: 'वित्तीय साक्षरता',
    tools: 'स्मार्ट टूल्स',
    'expense-tracker': 'व्यय ट्रैकर',
    'emi-calculator': 'ईएमआई कैलकुलेटर',
    'financial-score': 'वित्तीय स्कोर',
    analytics: 'विश्लेषण',
    notifications: 'सूचनाएं',
    schemes: 'सरकारी योजनाएं',
    documents: 'दस्तावेज़',
    community: 'समुदाय',
    'ai-advisor': 'एआई सलाहकार',
    settings: 'सेटिंग्स',

    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'मिटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    view: 'देखें',
    close: 'बंद करें',

    // Dashboard
    welcome: 'वापसी पर स्वागत है',
    totalLoans: 'कुल ऋण',
    activeLoans: 'सक्रिय ऋण',
    monthlyEMI: 'मासिक ईएमआई',
    nextPayment: 'अगला भुगतान',

    // Loan Management
    loanManagement: 'ऋण प्रबंधन',
    loanDescription: 'अपने व्यावसायिक ऋणों की गणना, तुलना और प्रबंधन करें।',
    addNewLoan: 'नया ऋण आवेदन करें',
    loanEligibility: 'ऋण पात्रता जांच',
    checkEligibility: 'पात्रता जांचें',
    applicationStatus: 'ऋण आवेदन स्थिति',
    viewStatus: 'स्थिति देखें',

    // Expense Tracker
    expenseTracker: 'व्यय ट्रैकर',
    trackExpenses: 'अपने साप्ताहिक और मासिक व्यय ट्रैक करें',
    addExpense: 'व्यय जोड़ें',
    totalExpenses: 'कुल व्यय',
    weeklyExpenses: 'साप्ताहिक व्यय',
    monthlyExpenses: 'मासिक व्यय',
    expenseCategories: 'व्यय श्रेणियां',

    // AI Advisor
    aiAdvisor: 'एआई वित्तीय सलाहकार',
    askAnything: 'अपने वित्त के बारे में कुछ भी पूछें...',
    clearChat: 'चैट साफ़ करें',

    // Settings
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    marathi: 'मराठी',
  },
  ta: {
    // Navigation
    dashboard: 'டாஷ்போர்டு',
    loans: 'கடன் மேலாண்மை',
    training: 'நிதி அறிவுத்திறன்',
    tools: 'ஸ்மார்ட் கருவிகள்',
    'expense-tracker': 'செலவு டிராக்கர்',
    'emi-calculator': 'இஎம்ஐ கால்குலேட்டர்',
    'financial-score': 'நிதி ஸ்கோர்',
    analytics: 'பகுப்பாய்வு',
    notifications: 'அறிவிப்புகள்',
    schemes: 'அரசு திட்டங்கள்',
    documents: 'ஆவணங்கள்',
    community: 'சமூகம்',
    'ai-advisor': 'எஐ ஆலோசகர்',
    settings: 'அமைப்புகள்',

    // Common
    loading: 'ஏற்றப்படுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    add: 'சேர்',
    view: 'பார்',
    close: 'மூடு',

    // Dashboard
    welcome: 'மீண்டும் வருக',
    totalLoans: 'மொத்த கடன்கள்',
    activeLoans: 'செயலில் உள்ள கடன்கள்',
    monthlyEMI: 'மாதாந்திர இஎம்ஐ',
    nextPayment: 'அடுத்த கட்டணம்',

    // Loan Management
    loanManagement: 'கடன் மேலாண்மை',
    loanDescription: 'உங்கள் வணிக கடன்களை கணக்கிடு, ஒப்பிடு மற்றும் மேலாண்மை செய்.',
    addNewLoan: 'புதிய கடன் விண்ணப்பிக்க',
    loanEligibility: 'கடன் தகுதி சரிபார்ப்பு',
    checkEligibility: 'தகுதி சரிபார்',
    applicationStatus: 'கடன் விண்ணப்ப நிலை',
    viewStatus: 'நிலை பார்',

    // Expense Tracker
    expenseTracker: 'செலவு டிராக்கர்',
    trackExpenses: 'உங்கள் வாராந்திர மற்றும் மாதாந்திர செலவுகளை கண்காணிக்க',
    addExpense: 'செலவு சேர்',
    totalExpenses: 'மொத்த செலவுகள்',
    weeklyExpenses: 'வாராந்திர செலவுகள்',
    monthlyExpenses: 'மாதாந்திர செலவுகள்',
    expenseCategories: 'செலவு வகைகள்',

    // AI Advisor
    aiAdvisor: 'எஐ நிதி ஆலோசகர்',
    askAnything: 'உங்கள் நிதியைப் பற்றி எதையும் கேளுங்கள்...',
    clearChat: 'அரட்டையை அழி',

    // Settings
    language: 'மொழி',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    marathi: 'मराठी',
  },
  te: {
    // Navigation
    dashboard: 'డాష్బోర్డ్',
    loans: 'రుణ నిర్వహణ',
    training: 'ఆర్థిక అక్షరాస్యత',
    tools: 'స్మార్ట్ టూల్స్',
    'expense-tracker': 'వ్యయ ట్రాకర్',
    'emi-calculator': 'ఇఎంఐ క్యాల్కులేటర్',
    'financial-score': 'ఆర్థిక స్కోర్',
    analytics: 'విశ్లేషణ',
    notifications: 'నోటిఫికేషన్లు',
    schemes: 'ప్రభుత్వ పథకాలు',
    documents: 'పత్రాలు',
    community: 'సమాజం',
    'ai-advisor': 'ఎఐ సలహాదారు',
    settings: 'సెట్టింగులు',

    // Common
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    cancel: 'రద్దు చేయి',
    save: 'సేవ్ చేయి',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    add: 'జోడించు',
    view: 'చూడు',
    close: 'మూసివేయి',

    // Dashboard
    welcome: 'తిరిగి స్వాగతం',
    totalLoans: 'మొత్తం రుణాలు',
    activeLoans: 'చురుకైన రుణాలు',
    monthlyEMI: 'నెలవారీ ఇఎంఐ',
    nextPayment: 'తదుపరి చెల్లింపు',

    // Loan Management
    loanManagement: 'రుణ నిర్వహణ',
    loanDescription: 'మీ వ్యాపార రుణాలను లెక్కించు, పోల్చు మరియు నిర్వహించు.',
    addNewLoan: 'కొత్త రుణం దరఖాస్తు చేయి',
    loanEligibility: 'రుణ అర్హత తనిఖీ',
    checkEligibility: 'అర్హత తనిఖీ చేయి',
    applicationStatus: 'రుణ దరఖాస్తు స్థితి',
    viewStatus: 'స్థితి చూడు',

    // Expense Tracker
    expenseTracker: 'వ్యయ ట్రాకర్',
    trackExpenses: 'మీ వారపు మరియు నెలవారీ వ్యయాలను ట్రాక్ చేయండి',
    addExpense: 'వ్యయం జోడించు',
    totalExpenses: 'మొత్తం వ్యయాలు',
    weeklyExpenses: 'వారపు వ్యయాలు',
    monthlyExpenses: 'నెలవారీ వ్యయాలు',
    expenseCategories: 'వ్యయ వర్గాలు',

    // AI Advisor
    aiAdvisor: 'ఎఐ ఆర్థిక సలహాదారు',
    askAnything: 'మీ ఆర్థిక విషయాల గురించి ఏమైనా అడగండి...',
    clearChat: 'చాట్ క్లియర్ చేయి',

    // Settings
    language: 'భాష',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    marathi: 'मराठी',
  },
  mr: {
    // Navigation
    dashboard: 'डॅशबोर्ड',
    loans: 'कर्ज व्यवस्थापन',
    training: 'आर्थिक साक्षरता',
    tools: 'स्मार्ट साधने',
    'expense-tracker': 'खर्च ट्रॅकर',
    'emi-calculator': 'ईएमआय कॅल्क्युलेटर',
    'financial-score': 'आर्थिक स्कोअर',
    analytics: 'विश्लेषण',
    notifications: 'सूचना',
    schemes: 'सरकारी योजना',
    documents: 'कागदपत्रे',
    community: 'समुदाय',
    'ai-advisor': 'एआय सल्लागार',
    settings: 'सेटिंग्ज',

    // Common
    loading: 'लोड होत आहे...',
    error: 'त्रुटी',
    success: 'यश',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    add: 'जोडा',
    view: 'पहा',
    close: 'बंद करा',

    // Dashboard
    welcome: 'परत स्वागत आहे',
    totalLoans: 'एकूण कर्जे',
    activeLoans: 'सक्रिय कर्जे',
    monthlyEMI: 'मासिक ईएमआय',
    nextPayment: 'पुढील देय',

    // Loan Management
    loanManagement: 'कर्ज व्यवस्थापन',
    loanDescription: 'तुमच्या व्यवसायिक कर्जांची गणना, तुलना आणि व्यवस्थापन करा.',
    addNewLoan: 'नवीन कर्ज अर्ज करा',
    loanEligibility: 'कर्ज पात्रता तपासणी',
    checkEligibility: 'पात्रता तपासा',
    applicationStatus: 'कर्ज अर्ज स्थिती',
    viewStatus: 'स्थिती पहा',

    // Expense Tracker
    expenseTracker: 'खर्च ट्रॅकर',
    trackExpenses: 'तुमचे आठवड्याचे आणि महिन्याचे खर्च ट्रॅक करा',
    addExpense: 'खर्च जोडा',
    totalExpenses: 'एकूण खर्च',
    weeklyExpenses: 'आठवड्याचे खर्च',
    monthlyExpenses: 'महिन्याचे खर्च',
    expenseCategories: 'खर्च श्रेणी',

    // AI Advisor
    aiAdvisor: 'एआय आर्थिक सल्लागार',
    askAnything: 'तुमच्या आर्थिक बाबींबद्दल काहीही विचारा...',
    clearChat: 'गप्पा साफ करा',

    // Settings
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    marathi: 'मराठी',
  },
};

type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('finzeal_language');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('finzeal_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};