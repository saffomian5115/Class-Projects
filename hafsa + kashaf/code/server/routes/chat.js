const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Chat = require('../models/Chat');
const { protect } = require('../middleware/auth');

// ─── Emergency keywords ───────────────────────────────────────────────────────
const EMERGENCY_KEYWORDS = {
  english: ['chest pain','heart attack','stroke','cant breathe',"can't breathe",'unconscious',
            'bleeding heavily','severe pain','poisoning','overdose','seizure','choking',
            'not breathing','fainted','collapsed','difficulty breathing'],
  urdu:    ['سینے میں درد','دل کا دورہ','سانس نہیں','بہت خون','بے ہوش','زہر','دورہ'],
  turkish: ['göğüs ağrısı','kalp krizi','nefes alamıyorum','bayıldı','çok kanıyor','zehirlenme','nefes']
};

const EMERGENCY_ALERTS = {
  english: '\n\n🚨 EMERGENCY ALERT: Your symptoms may need immediate medical attention!\n• 🇵🇰 Pakistan: 1122 / 115\n• 🇺🇸 USA: 911\n• 🇬🇧 UK: 999\n• 🇹🇷 Turkey: 112\n\nPlease call emergency services NOW!',
  urdu:    '\n\n🚨 ہنگامی الرٹ: فوری طبی امداد ضروری ہے!\n• 🇵🇰 پاکستان: 1122 / 115\n• 🇺🇸 USA: 911\n• 🇬🇧 UK: 999\n• 🇹🇷 ترکی: 112\n\nابھی ایمرجنسی سروسز کو کال کریں!',
  turkish: '\n\n🚨 ACİL UYARI: Semptomlarınız acil tıbbi müdahale gerektirebilir!\n• 🇵🇰 Pakistan: 1122 / 115\n• 🇺🇸 ABD: 911\n• 🇬🇧 İngiltere: 999\n• 🇹🇷 Türkiye: 112\n\nLütfen hemen acil servisi arayın!'
};

// ─── Rule-based smart responses ───────────────────────────────────────────────
const SMART_RESPONSES = {
  english: {
    'stomach pain|stomach ache|abdominal pain|belly pain': `I understand you're experiencing stomach pain. Here are some helpful tips:\n\n• **Rest** and avoid heavy foods\n• Drink plenty of water or herbal tea (ginger, peppermint)\n• Apply a warm compress to the abdomen\n• Avoid spicy, fatty, or acidic foods\n• Try eating small, frequent meals\n\n⚠️ See a doctor if pain is severe, lasts more than 2 days, or is accompanied by fever or vomiting.\n\n*Remember: This is general advice. Always consult a qualified doctor for proper diagnosis.*`,
    'acid reflux|heartburn|acidity|gerd': `For acid reflux and heartburn:\n\n• **Avoid** spicy foods, caffeine, alcohol, and citrus fruits\n• Eat smaller meals — don't overeat\n• Don't lie down immediately after eating (wait 2-3 hours)\n• Elevate your head while sleeping\n• Drink cold milk or eat yogurt for quick relief\n• Ginger tea can help reduce acidity\n\n💊 If symptoms occur more than twice a week, please consult a gastroenterologist.\n\n*This is general health information, not medical advice.*`,
    'diarrhea|loose stool|loose motion': `For managing diarrhea:\n\n• **Stay hydrated** — drink ORS (Oral Rehydration Solution), water, or coconut water\n• Eat the BRAT diet: **Bananas, Rice, Applesauce, Toast**\n• Avoid dairy, fatty foods, and caffeine\n• Take probiotics (yogurt) to restore gut bacteria\n• Rest and avoid strenuous activity\n\n⚠️ Seek medical help if diarrhea lasts more than 3 days, contains blood, or if you have high fever.\n\n*Always consult a doctor for persistent symptoms.*`,
    'constipation|hard stool|cant poop': `For constipation relief:\n\n• **Increase fiber** intake — eat fruits, vegetables, whole grains\n• Drink 8-10 glasses of water daily\n• Exercise regularly (even a 30-minute walk helps)\n• Try warm lemon water in the morning\n• Don't ignore the urge to use the toilet\n• Prunes and figs are natural laxatives\n\n💡 If constipation lasts more than 2 weeks, see a doctor — it could indicate an underlying condition.\n\n*This is general advice. Consult a healthcare provider for chronic issues.*`,
    'nausea|vomiting|feeling sick|nauseous': `For nausea and vomiting:\n\n• Sip cold water or ginger tea slowly\n• Eat small, bland meals (crackers, plain rice)\n• Avoid strong smells and greasy foods\n• Rest in a cool, well-ventilated room\n• Try acupressure on the P6 wrist point\n• Peppermint tea can help calm the stomach\n\n⚠️ See a doctor if vomiting is severe, contains blood, or lasts more than 24 hours.\n\n*Consult a doctor if symptoms persist.*`,
    'diet|nutrition|what to eat|healthy food|healthy eating': `A gastro-healthy diet includes:\n\n🥦 **Foods to eat:**\n• High-fiber foods (oats, vegetables, fruits)\n• Lean proteins (chicken, fish, legumes)\n• Probiotics (yogurt, kefir, fermented foods)\n• Plenty of water (8+ glasses/day)\n• Ginger and turmeric (anti-inflammatory)\n\n🚫 **Foods to avoid:**\n• Processed/junk food\n• Excessive spicy or oily food\n• Carbonated drinks\n• Alcohol and caffeine\n• Very large meals\n\n*Good nutrition is the foundation of digestive health!*`,
    'gas|bloating|flatulence|burping': `For bloating and gas:\n\n• Eat slowly and chew food thoroughly\n• Avoid carbonated drinks and chewing gum\n• Reduce intake of beans, cabbage, and onions\n• Try peppermint or fennel tea after meals\n• Exercise lightly after eating (a short walk)\n• Avoid swallowing air while eating\n\n💡 Probiotics can significantly reduce bloating over time.\n\n*If bloating is constant and painful, consult a gastroenterologist.*`,
    'weight|obesity|overweight|lose weight': `For healthy weight management:\n\n• Aim for a **caloric deficit** of 300-500 calories/day\n• Exercise 150+ minutes per week (walking, swimming, cycling)\n• Eat more protein and fiber to feel full longer\n• Avoid sugar, processed foods, and liquid calories\n• Sleep 7-8 hours — poor sleep increases weight gain hormones\n• Stay hydrated — sometimes thirst feels like hunger\n\n⚠️ Extreme dieting is harmful. Consult a nutritionist for a personalized plan.\n\n*Sustainable weight loss is 0.5-1kg per week.*`,
    'fever|temperature|high temperature': `For managing fever:\n\n• Rest and stay hydrated (water, clear soups)\n• Take paracetamol/acetaminophen as directed\n• Use a cool damp cloth on forehead\n• Wear light clothing\n• Keep the room ventilated\n\n🚨 Go to emergency if:\n• Fever is above 39.5°C (103°F)\n• Fever lasts more than 3 days\n• Accompanied by severe headache, rash, or stiff neck\n\n*Always follow a doctor's guidance for fever management.*`,
    'sleep|insomnia|cant sleep|sleep problem': `For better sleep:\n\n• Keep a consistent sleep schedule (same time daily)\n• Avoid screens 1 hour before bed\n• Keep bedroom cool, dark, and quiet\n• Avoid caffeine after 2pm\n• Try chamomile tea or warm milk before bed\n• Practice deep breathing or light stretching\n\n💡 Chronic insomnia can affect digestion and overall health. See a doctor if it persists.\n\n*Good sleep is essential for gut health too!*`,
  },
  urdu: {
    'پیٹ درد|معدے میں درد|پیٹ میں تکلیف': `معدے کے درد کے لیے مفید مشورے:\n\n• آرام کریں اور بھاری کھانے سے پرہیز کریں\n• ادرک یا پودینے کی چائے پئیں\n• پیٹ پر گرم کپڑا رکھیں\n• مرچ مسالے اور تلے ہوئے کھانے سے پرہیز کریں\n• تھوڑا تھوڑا کھانا کھائیں\n\n⚠️ اگر درد شدید ہو، 2 دن سے زیادہ رہے یا بخار ہو تو فوری ڈاکٹر سے ملیں۔\n\n*یہ عام معلومات ہیں۔ تشخیص کے لیے ڈاکٹر سے رجوع کریں۔*`,
    'تیزابیت|سینے میں جلن|ایسڈیٹی': `تیزابیت کے لیے:\n\n• مرچ، کافی اور ترش پھلوں سے پرہیز کریں\n• کھانے کے بعد فوری نہ لیٹیں\n• ٹھنڈا دودھ یا دہی فوری آرام دیتا ہے\n• سونے سے 2-3 گھنٹے پہلے کھانا کھائیں\n• ادرک کی چائے مددگار ہے\n\n💊 اگر ہفتے میں دو بار سے زیادہ ہو تو معدے کے ڈاکٹر سے ملیں۔`,
    'اسہال|پتلا پاخانہ|دست': `اسہال کے لیے:\n\n• ORS پئیں اور پانی زیادہ پئیں\n• کیلا، چاول، سیب کا جوس اور ٹوسٹ کھائیں\n• دودھ اور چکنائی سے پرہیز کریں\n• دہی کھائیں\n• آرام کریں\n\n⚠️ اگر 3 دن سے زیادہ رہے یا خون آئے تو فوری ڈاکٹر سے ملیں۔`,
    'قبض|سخت پاخانہ': `قبض کے لیے:\n\n• زیادہ پانی پئیں (8-10 گلاس روزانہ)\n• ریشے دار کھانے کھائیں (پھل، سبزیاں)\n• صبح گرم لیموں پانی پئیں\n• ہلکی ورزش کریں\n• آلو بخارہ اور انجیر قدرتی مددگار ہیں\n\n💡 2 ہفتے سے زیادہ رہے تو ڈاکٹر سے ملیں۔`,
  },
  turkish: {
    'mide ağrısı|karın ağrısı|mide': `Mide ağrısı için öneriler:\n\n• Dinlenin ve ağır yiyeceklerden kaçının\n• Zencefil veya nane çayı için\n• Karna sıcak kompres uygulayın\n• Baharatlı ve yağlı yiyeceklerden kaçının\n• Küçük porsiyonlar halinde yiyin\n\n⚠️ Ağrı şiddetliyse veya 2 günden uzun sürerse doktora gidin.\n\n*Bu genel bilgidir. Tanı için doktora başvurun.*`,
    'asit|mide yanması|reflü': `Asit reflü için:\n\n• Baharatlı yiyecekler, kafein ve narenciyeden kaçının\n• Yemekten sonra hemen uzanmayın\n• Soğuk süt veya yoğurt hızlı rahatlama sağlar\n• Zencefil çayı mideyi sakinleştirir\n\n💊 Haftada iki kezden fazla olursa gastroenterologa gidin.`,
    'ishal|ishâl': `İshal için:\n\n• ORS veya bol su için\n• Muz, pirinç, elma püresi ve tost yiyin\n• Süt ürünleri ve yağlı yiyeceklerden kaçının\n• Probiyotik yoğurt tüketin\n\n⚠️ 3 günden uzun sürerse veya kanda görülürse doktora gidin.`,
  }
};

const checkEmergency = (message, language) => {
  const keywords = EMERGENCY_KEYWORDS[language] || EMERGENCY_KEYWORDS.english;
  const lowerMsg = message.toLowerCase();
  return keywords.some(kw => lowerMsg.includes(kw.toLowerCase()));
};

const getRuleBasedResponse = (message, language) => {
  const responses = SMART_RESPONSES[language] || SMART_RESPONSES.english;
  const lowerMsg = message.toLowerCase();
  for (const [patterns, response] of Object.entries(responses)) {
    const patternList = patterns.split('|');
    if (patternList.some(p => lowerMsg.includes(p))) {
      return response;
    }
  }
  return null;
};

// ─── Hugging Face API call (multiple models with fallback) ────────────────────
const callHuggingFace = async (messages, language) => {
  const systemPrompts = {
    english: 'You are GastroCare AI, a medical health assistant specializing in gastroenterology, nutrition, and general health. Give helpful, concise, compassionate advice. Always recommend seeing a doctor for serious symptoms.',
    urdu: 'آپ GastroCare AI ہیں، معدے کی بیماریوں اور عمومی صحت کے ماہر۔ مختصر اور مددگار جواب دیں۔ سنگین علامات میں ڈاکٹر سے ملنے کی تاکید کریں۔',
    turkish: 'GastroCare AI olarak gastroenteroloji ve genel sağlık konusunda yardımcı oluyorsunuz. Kısa ve yardımcı cevaplar verin.'
  };

  const systemPrompt = systemPrompts[language] || systemPrompts.english;
  const lastMessages = messages.slice(-6);
  
  // Build conversation text
  const conversation = lastMessages.map(m =>
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
  ).join('\n');

  const prompt = `<|system|>\n${systemPrompt}\n<|user|>\n${conversation}\n<|assistant|>\n`;

  // Try multiple free models
  const models = [
    'HuggingFaceH4/zephyr-7b-beta',
    'mistralai/Mistral-7B-Instruct-v0.2',
    'tiiuae/falcon-7b-instruct',
    'google/flan-t5-large'
  ];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 400,
              temperature: 0.7,
              return_full_text: false,
              do_sample: true
            }
          }),
          signal: AbortSignal.timeout(15000) // 15 second timeout
        }
      );

      if (!response.ok) continue;

      const data = await response.json();

      if (data?.error?.includes('loading')) {
        // Model is loading, skip to next
        continue;
      }

      if (data && data[0] && data[0].generated_text) {
        let text = data[0].generated_text
          .replace(/<\|.*?\|>/g, '')
          .replace(/User:.*$/gms, '')
          .replace(/Assistant:/gi, '')
          .trim();
        
        if (text.length > 20) return text;
      }
    } catch (err) {
      continue; // try next model
    }
  }

  return null; // All models failed — will use rule-based
};

// ─── Main AI handler ──────────────────────────────────────────────────────────
const getAIResponse = async (messages, language) => {
  const lastUserMsg = messages[messages.length - 1]?.content || '';

  // 1. Try rule-based first (instant, always works)
  const ruleResponse = getRuleBasedResponse(lastUserMsg, language);
  
  // 2. Try Hugging Face API
  const hfResponse = await callHuggingFace(messages, language);
  
  // Use HF if it worked, else use rule-based
  if (hfResponse && hfResponse.length > 30) return hfResponse;
  if (ruleResponse) return ruleResponse;

  // 3. Generic fallback
  const fallbacks = {
    english: `Thank you for your question! As GastroCare AI, I'm here to help with health queries.\n\nFor your concern, I recommend:\n• Consulting a qualified healthcare professional for proper diagnosis\n• Maintaining a healthy diet rich in fiber and fluids\n• Getting regular exercise and adequate sleep\n• Avoiding processed foods and excessive stress\n\nIf your symptoms are severe or persistent, please see a doctor immediately.\n\n*I'm here to provide general health information, not medical diagnoses.*`,
    urdu: `آپ کے سوال کے لیے شکریہ! میں GastroCare AI ہوں اور آپ کی مدد کے لیے حاضر ہوں۔\n\nآپ کی صحت کے لیے عام مشورہ:\n• مناسب تشخیص کے لیے ڈاکٹر سے ملیں\n• متوازن اور صحت بخش غذا کھائیں\n• کافی پانی پئیں اور ورزش کریں\n• علامات شدید ہوں تو فوری ڈاکٹر سے ملیں\n\n*یہ عام معلومات ہیں، طبی تشخیص نہیں۔*`,
    turkish: `Sorunuz için teşekkürler! GastroCare AI olarak yardımcı olmak için buradayım.\n\nGenel sağlık önerileri:\n• Doğru teşhis için bir sağlık uzmanına başvurun\n• Dengeli ve sağlıklı beslenin\n• Bol su için ve düzenli egzersiz yapın\n• Semptomlar şiddetliyse hemen doktora gidin\n\n*Bu genel bilgidir, tıbbi tanı değildir.*`
  };

  return fallbacks[language] || fallbacks.english;
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all chats
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('title language createdAt updatedAt messages')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single chat
router.get('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new chat
router.post('/new', protect, async (req, res) => {
  try {
    const { language = 'english' } = req.body;
    const chat = await Chat.create({
      userId: req.user._id,
      language,
      messages: [],
      title: 'New Chat'
    });
    res.status(201).json(chat);
  } catch (error) {
    console.error('New chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST send message
router.post('/:id/message', protect, async (req, res) => {
  try {
    const { message, language = 'english' } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message is required' });

    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const isEmergency = checkEmergency(message, language);

    // Add user message
    chat.messages.push({ role: 'user', content: message });

    // Auto title from first message
    if (chat.messages.length === 1 || chat.title === 'New Chat') {
      chat.title = message.substring(0, 45) + (message.length > 45 ? '...' : '');
    }

    // Get AI response
    let aiResponse = await getAIResponse(chat.messages, language);

    // Append emergency alert if needed
    if (isEmergency) {
      aiResponse += (EMERGENCY_ALERTS[language] || EMERGENCY_ALERTS.english);
    }

    chat.messages.push({ role: 'assistant', content: aiResponse });
    chat.updatedAt = new Date();
    await chat.save();

    res.json({ response: aiResponse, isEmergency, chatId: chat._id, chat });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE chat
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
