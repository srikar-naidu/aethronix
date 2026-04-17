const fs = require('fs');

const file = 'src/data/translations.ts';
let content = fs.readFileSync(file, 'utf8');

const aihireTranslations = [
  `        aihire: {
            title: "AI Hire Assessments",
            subtitle: "Conduct technical interviews with an AI Engineer. Get incredibly detailed feedback and performance metrics.",
            startRecording: "Start Recording",
            stopRecording: "Stop Recording",
            transcribing: "Transcribing...",
            transcript: "Transcript",
            diagnostic: "Diagnostic Data",
            endGetReport: "End & Get Report",
            reportTitle: "Performance Analysis",
            whatYouDidWell: "What You Did Well",
            whereYouStruggled: "Where You Struggled",
            breakdown: "Question-by-Question Breakdown",
            yourAnswer: "Your Answer",
            feedback: "Feedback",
            shouldHaveSaid: "What You Should Have Said",
            howToImprove: "How to Improve",
            tipsNextTime: "Tips for Next Time",
            tryAnother: "Try Another Interview",
            downloadPdf: "Download Report PDF"
        },
`,
  `        aihire: {
            title: "एआई हायर मूल्यांकन",
            subtitle: "एक एआई इंजीनियर के साथ तकनीकी साक्षात्कार आयोजित करें। विस्तृत प्रतिक्रिया और प्रदर्शन मेट्रिक्स प्राप्त करें।",
            startRecording: "रिकॉर्डिंग शुरू करें",
            stopRecording: "रिकॉर्डिंग बंद करें",
            transcribing: "ट्रांसक्राइब हो रहा है...",
            transcript: "ट्रांसक्रिप्शन",
            diagnostic: "नैदानिक डेटा",
            endGetReport: "समाप्त करें और रिपोर्ट प्राप्त करें",
            reportTitle: "प्रदर्शन विश्लेषण",
            whatYouDidWell: "आपने क्या अच्छा किया",
            whereYouStruggled: "आपने कहाँ संघर्ष किया",
            breakdown: "प्रश्न-दर-प्रश्न विश्लेषण",
            yourAnswer: "आपका उत्तर",
            feedback: "प्रतिक्रिया",
            shouldHaveSaid: "आपको क्या कहना चाहिए था",
            howToImprove: "कैसे सुधारें",
            tipsNextTime: "अगली बार के लिए टिप्स",
            tryAnother: "एक और इंटरव्यू आज़माएं",
            downloadPdf: "रिपोर्ट पीडीएफ डाउनलोड करें"
        },
`,
  `        aihire: {
            title: "ఏఐ ఆన్లైన్ ఇంటర్వ్యూలు",
            subtitle: "ఏఐ ఇంజనీర్ తో టెక్నికల్ ఇంటర్వ్యూకి హాజరుకండి. పూర్తి ఫీడ్‌బ్యాక్ మరియు స్కోరును పొందండి.",
            startRecording: "రికార్డింగ్ ప్రారంభించండి",
            stopRecording: "రికార్డింగ్ ఆపండి",
            transcribing: "ట్రాన్స్‌క్రైబ్ చేస్తోంది...",
            transcript: "ట్రాన్స్‌క్రిప్ట్",
            diagnostic: "డయాగ్నస్టిక్ డేటా",
            endGetReport: "ముగించి రిపోర్ట్ పొందండి",
            reportTitle: "పెర్ఫార్మన్స్ రిపోర్ట్",
            whatYouDidWell: "మీరు బాగా చేసినవి",
            whereYouStruggled: "మీరు ఇబ్బంది పడినవి",
            breakdown: "ప్రశ్నల వారీగా విశ్లేషణ",
            yourAnswer: "మీ సమాధానం",
            feedback: "ఫీడ్‌బ్యాక్",
            shouldHaveSaid: "మీరు ఎలా చెప్పి ఉండాల్సింది",
            howToImprove: "ఎలా మెరుగుపరచాలి",
            tipsNextTime: "తదుపరి ఇంటర్వ్యూకి చిట్కాలు",
            tryAnother: "మరొక ఇంటర్వ్యూ ప్రయత్నించండి",
            downloadPdf: "రిపోర్ట్ పీడీఎఫ్ డౌన్‌లోడ్ చేయండి"
        },
`,
  `        aihire: {
            title: "செயற்கை நுண்ணறிவு நேர்காணல்கள்",
            subtitle: "ஏஐ இன்ஜினியருடன் தொழில்நுட்ப நேர்காணல்களை மேற்கொள்ளுங்கள். முழுமையான கருத்து மற்றும் மதிப்பெண்களைப் பெறுங்கள்.",
            startRecording: "பதிவு செய்யத் தொடங்கு",
            stopRecording: "பதிவை நிறுத்து",
            transcribing: "எழுத்துப்பெயர்க்கிறது...",
            transcript: "படியெடுத்தல்",
            diagnostic: "கண்டறியும் தரவு",
            endGetReport: "முடித்து அறிக்கையைப் பெறு",
            reportTitle: "செயல்திறன் பகுப்பாய்வு",
            whatYouDidWell: "நீங்கள் சிறப்பாக செய்தவை",
            whereYouStruggled: "நீங்கள் சிரமப்பட்டவை",
            breakdown: "கேள்வி வாரியான பகுப்பாய்வு",
            yourAnswer: "உங்கள் பதில்",
            feedback: "பின்னூட்டம்",
            shouldHaveSaid: "நீங்கள் என்ன சொல்லியிருக்க வேண்டும்",
            howToImprove: "எப்படி மேம்படுத்துவது",
            tipsNextTime: "அடுத்த முறைக்கான குறிப்புகள்",
            tryAnother: "மற்றொரு நேர்காணலை முயற்சிக்கவும்",
            downloadPdf: "அறிக்கை பிடிஎஃப் பதிவிறக்கு"
        },
`,
  `        aihire: {
            title: "ಎಐ ಸಂದರ್ಶನಗಳು",
            subtitle: "ಎಐ ಇಂಜಿನಿಯರ್ ಜೊತೆಗೆ ತಾಂತ್ರಿಕ ಸಂದರ್ಶನ ನಡೆಸಿ. ವಿವರವಾದ ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಸ್ಕೋರ್ ಪಡೆಯಿರಿ.",
            startRecording: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
            stopRecording: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
            transcribing: "ಲಿಪ್ಯಂತರ ಮಾಡಲಾಗುತ್ತಿದೆ...",
            transcript: "ಲಿಪ್ಯಂತರ",
            diagnostic: "ರೋಗನಿರ್ಣಯ ದತ್ತಾಂಶ",
            endGetReport: "ಮುಕ್ತಾಯಗೊಳಿಸಿ ವರದಿ ಪಡೆಯಿರಿ",
            reportTitle: "ಕಾರ್ಯಕ್ಷಮತೆಯ ವಿಶ್ಲೇಷಣೆ",
            whatYouDidWell: "ನೀವು ಚೆನ್ನಾಗಿ ಮಾಡಿದ್ದು",
            whereYouStruggled: "ನೀವು ಎಡವಿದ್ದು",
            breakdown: "ಪ್ರಶ್ನೆ-ವಾರು ವಿಶ್ಲೇಷಣೆ",
            yourAnswer: "ನಿಮ್ಮ ಉತ್ತರ",
            feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
            shouldHaveSaid: "ನೀವು ಏನು ಹೇಳಬೇಕಾಗಿತ್ತು",
            howToImprove: "ಹೇಗೆ ಸುಧಾರಿಸುವುದು",
            tipsNextTime: "ಮುಂದಿನ ಬಾರಿಗೆ ಸಲಹೆಗಳು",
            tryAnother: "ಮತ್ತೊಂದು ಸಂದರ್ಶನ ಪ್ರಯತ್ನಿಸಿ",
            downloadPdf: "ವರದಿ ಪಿಡಿಎಫ್ ಡೌನ್ಲೋಡ್ ಮಾಡಿ"
        },
`,
  `        aihire: {
            title: "এআই ইন্টারভিউ অসেসমেন্ট",
            subtitle: "এআই ইঞ্জিনিয়ারের সাথে প্রযুক্তিগত ইন্টারভিউ দিন। বিস্তারিত মতামত এবং মূল্যায়ণ পান।",
            startRecording: "রেকর্ডিং শুরু করুন",
            stopRecording: "রেকর্ডিং বন্ধ করুন",
            transcribing: "ট্রান্সক্রাইব করা হচ্ছে...",
            transcript: "ট্রান্সক্রিপ্ট",
            diagnostic: "ডায়াগনস্টিক তথ্য",
            endGetReport: "শেষ করুন এবং রিপোর্ট পান",
            reportTitle: "কর্মক্ষমতা বিশ্লেষণ",
            whatYouDidWell: "আপনি যা ভালো করেছেন",
            whereYouStruggled: "আপনি যেখানে সংগ্রাম করেছেন",
            breakdown: "প্রশ্ন-ভিত্তিক বিশ্লেষণ",
            yourAnswer: "আপনার উত্তর",
            feedback: "মতামত",
            shouldHaveSaid: "আপনার কী বলা উচিত ছিল",
            howToImprove: "কীভাবে উন্নতি করবেন",
            tipsNextTime: "পরবর্তী সময়ের জন্য টিপস",
            tryAnother: "আরেকটি ইন্টারভিউ চেষ্টা করুন",
            downloadPdf: "রিপোর্ট পিডিএফ ডাউনলোড করুন"
        },
`,
  `        aihire: {
            title: "એઆઈ ઇન્ટરવ્યુ આકારણીઓ",
            subtitle: "એઆઈ એન્જિનિયર સાથે તકનીકી ઇન્ટરવ્યુ લો. વિગતવાર પ્રતિસાદ અને ગુણ મેળવો.",
            startRecording: "રેકોર્ડિંગ શરૂ કરો",
            stopRecording: "રેકોર્ડિંગ બંધ કરો",
            transcribing: "ટ્રાન્સક્રિપ્શન થઈ રહ્યું છે...",
            transcript: "ટ્રાન્સક્રિપ્ટ",
            diagnostic: "નિદાન ડેટા",
            endGetReport: "સમાપ્ત કરો અને રિપોર્ટ મેળવો",
            reportTitle: "પ્રદર્શન વિશ્લેષણ",
            whatYouDidWell: "તમે શું સારું કર્યું",
            whereYouStruggled: "તમે ક્યાં સંઘર્ષ કર્યો",
            breakdown: "પ્રશ્ન મુજબ વિશ્લેષણ",
            yourAnswer: "તમારો જવાબ",
            feedback: "પ્રતિસાદ",
            shouldHaveSaid: "તમારે શું કહેવું જોઈતું હતું",
            howToImprove: "કેવી રીતે સુધારવું",
            tipsNextTime: "આગામી સમય માટે ટિપ્સ",
            tryAnother: "બીજો ઇન્ટરવ્યુ અજમાવો",
            downloadPdf: "રિપોર્ટ પીડીએફ ડાઉનલોડ કરો"
        },
`,
  `        aihire: {
            title: "एआय मुलाखत मूल्यमापन",
            subtitle: "एआय इंजिनीअरसोबत तांत्रिक मुलाखत द्या. सविस्तर अभिप्राय आणि गुण मिळवा.",
            startRecording: "रेकॉर्डिंग सुरू करा",
            stopRecording: "रेकॉर्डिंग थांबवा",
            transcribing: "ट्रान्सक्राइब करत आहे...",
            transcript: "ट्रान्सक्रिप्ट",
            diagnostic: "डायग्नोस्टिक डेटा",
            endGetReport: "थांबवा आणि रिपोर्ट मिळवा",
            reportTitle: "कामगिरी विश्लेषण",
            whatYouDidWell: "तुम्ही काय चांगले केले",
            whereYouStruggled: "तुम्ही कुठे अडखळलात",
            breakdown: "प्रश्न-निहाय विश्लेषण",
            yourAnswer: "तुमचे उत्तर",
            feedback: "अभिप्राय",
            shouldHaveSaid: "तुम्ही काय म्हणायला हवे होते",
            howToImprove: "कशी सुधारणा करावी",
            tipsNextTime: "पुढच्या वेळेसाठी टिप्स",
            tryAnother: "दुसरी मुलाखत वापरून पहा",
            downloadPdf: "रिपोर्ट पीडीएफ डाउनलोड करा"
        },
`
];

let parts = content.split('        aihire: {');
if (parts.length === 9) { // 1 before first + 8 languages
  // Reconstruct the file but we need to cut out the rest of the old 'aihire' block which ends at '},' right before 'resumeparser: {'
  
  // We can just find the end of each block by looking for '        resumeparser: {' since it strictly follows aihire.
  
  let newContent = parts[0];
  for (let i = 1; i < parts.length; i++) {
    // parts[i] contains the rest of the file after 'aihire: {'
    // Find the end of the old aihire block
    const resumeparserIndex = parts[i].indexOf('        resumeparser: {');
    const remainingPart = parts[i].slice(resumeparserIndex);
    
    newContent += aihireTranslations[i-1] + remainingPart;
  }
  
  fs.writeFileSync(file, newContent);
  console.log("Successfully injected AI Hire.");
} else {
  console.log("Could not find exactly 8 'aihire: {' blocks. Found:", parts.length - 1);
}
