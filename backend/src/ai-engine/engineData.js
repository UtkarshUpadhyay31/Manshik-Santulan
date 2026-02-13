export const EMOTIONS_DATA = [
    {
        name: 'Stress',
        keywords: {
            en: [
                { word: 'stress', weight: 3 }, { word: 'pressure', weight: 2 }, { word: 'overwhelmed', weight: 4 },
                { word: 'burden', weight: 2 }, { word: 'tension', weight: 3 }, { word: 'heavy', weight: 2 },
                { word: 'too much', weight: 2 }, { word: 'busy', weight: 1 }, { word: 'hectic', weight: 2 }
            ],
            hi: [
                { word: 'tanaav', weight: 3 }, { word: 'bojh', weight: 2 }, { word: 'pareshan', weight: 2 },
                { word: 'dabav', weight: 3 }
            ]
        },
        templates: {
            validation: {
                en: ["I can hear how much pressure you're under right now.", "It sounds like you're carrying a very heavy load."],
                hi: ["Main samajh sakta hoon ki aap par is waqt kitna dabav hai.", "Aap kaafi bhari bojh mehsoos kar rahe hain."]
            },
            reflection: {
                en: ["You're feeling overwhelmed by the weight of everything on your plate.", "It feels like there's 'too much' happening all at once."],
                hi: ["Aap har cheez ke bojh se dabe hue mehsoos kar rahe hain.", "Aisa lag raha hai jaise sab kuch ek saath ho raha hai."]
            },
            insight: {
                en: ["Stress is often our system's way of trying to protect us when we feel out of control.", "Sometimes the only way to manage the 'too much' is to focus on just 'one small thing' at a time."],
                hi: ["Tanaav hamare dimag ka ek tareeka hai humein bachane ka jab humein lagta hai ki sab hamare hath se nikal raha hai.", "Kabhi kabhi 'sab kuch' sambhalne ka rasta sirf 'ek choti cheez' par dhyan dena hota hai."]
            },
            action: {
                en: ["Let's try a 2-minute reset. Pick one small task we can mentally set aside for now.", "Would it help to just breathe through this next minute together?"],
                hi: ["Chaliye 2-minute ka aaram karte hain. Ek aisi cheez chuniye jise hum abhi ke liye side mein rakh de.", "Kya ek minute ke liye saath saans lena madadgaar hoga?"]
            },
            followUp: {
                en: ["What is the single loudest thing in your head right now?", "If you could drop one responsibility today without consequences, what would it be?"],
                hi: ["Is waqt aapke dimag mein sabse badi cheez kya chal rahi hai?", "Agar aap aaj ek zimmedari chhod sakein, toh wo kya hogi?"]
            }
        },
        mode: 'Calm'
    },
    {
        name: 'Anxiety',
        keywords: {
            en: [
                { word: 'anxious', weight: 3 }, { word: 'panic', weight: 4 }, { word: 'scared', weight: 3 },
                { word: 'fear', weight: 3 }, { word: 'worried', weight: 2 }, { word: 'shaking', weight: 3 },
                { word: 'heart racing', weight: 4 }, { word: 'uneasy', weight: 2 }, { word: 'nervous', weight: 2 }
            ],
            hi: [
                { word: 'ghabrahat', weight: 4 }, { word: 'dar', weight: 3 }, { word: 'chinta', weight: 2 },
                { word: 'bechaini', weight: 3 }
            ]
        },
        templates: {
            validation: {
                en: ["I can feel how tight your chest feels right now. Anxiety is a powerful physical sensation.", "It's okay to feel scared. Your body is just trying to alert you."],
                hi: ["Main samajh sakta hoon ki aapka dil kitni tez dhadak raha hai.", "Darna swabhavik hai, aapki body bas aapko alert kar rahi hai."]
            },
            reflection: {
                en: ["You're feeling a sense of unease or fear about what's coming next.", "It sounds like your mind is racing with 'what-ifs'."],
                hi: ["Aap is waqt kaafi bechain aur dare hue mehsoos kar rahe hain."]
            },
            insight: {
                en: ["Anxiety is often just our imagination projecting a difficult future into the present.", "The body doesn't know the difference between a real threat and a thought."],
                hi: ["Chinta aksar hamari kalpana hi hoti hai jo mushkil bhavishya ko aaj mein dikhati hai."]
            },
            action: {
                en: ["Let's use the Grounding tool—can you name 3 things you can see right now?", "Try slow, even breaths: Inhale for 4, exhale for 6."],
                hi: ["Chaliye Grounding karte hain—kya aap 3 aisi cheezein bata sakte hain jo aap abhi dekh rahe hain?"]
            },
            followUp: {
                en: ["What's one thing in this room that feels very steady and real?", "Is there a small part of you that knows you're safe in this very moment?"],
                hi: ["Is kamre mein aisi kaunsi cheez hai jo bahut mazboot aur sach hai?"]
            }
        },
        mode: 'Clarity'
    },
    {
        name: 'Sadness',
        keywords: {
            en: [
                { word: 'sad', weight: 3 }, { word: 'unhappy', weight: 2 }, { word: 'crying', weight: 3 },
                { word: 'depressed', weight: 4 }, { word: 'hopeless', weight: 4 }, { word: 'heartbroken', weight: 3 },
                { word: 'empty', weight: 2 }, { word: 'grief', weight: 3 }, { word: 'miserable', weight: 3 }
            ],
            hi: [
                { word: 'dukh', weight: 3 }, { word: 'udaas', weight: 3 }, { word: 'rona', weight: 2 },
                { word: 'nirasha', weight: 4 }, { word: 'dukhy', weight: 2 }
            ]
        },
        templates: {
            validation: {
                en: ["I can feel the weight of your sadness, and I want you to know it's okay to feel this way.", "It sounds like you're carrying a lot of pain right now."],
                hi: ["Main aapka dukh samajh sakta hoon, aur ye bilkul swabhavik hai."]
            },
            reflection: {
                en: ["You're feeling a deep sense of loss or sadness right now.", "It feels like things are very heavy for you at the moment."],
                hi: ["Aap is waqt kaafi udaas mehsoos kar rahe hain."]
            },
            insight: {
                en: ["Sadness often reminds us of what we truly value in life.", "Sometimes the heart needs time to process things that words can't explain."],
                hi: ["Dukh humein un cheezon ki yaad dilata hai jo hamare liye mahatvapurna hain."]
            },
            action: {
                en: ["Maybe we can start by just taking one slow, deep breath together?", "Would it help to write down one small thing that brought peace today?"],
                hi: ["Kya hum ek gehri saans saath le sakte hain?"]
            },
            followUp: {
                en: ["What feels like the heaviest part of this right now?", "I'm here for as long as you need to talk—what else is on your mind?"],
                hi: ["Is waqt sabse mushkil kya lag raha hai?"]
            }
        },
        mode: 'Calm'
    },
    {
        name: 'Anger',
        keywords: {
            en: [
                { word: 'angry', weight: 3 }, { word: 'mad', weight: 2 }, { word: 'furious', weight: 4 },
                { word: 'frustrated', weight: 2 }, { word: 'hate', weight: 3 }, { word: 'annoyed', weight: 2 },
                { word: 'irritated', weight: 2 }, { word: 'rage', weight: 4 }
            ],
            hi: [
                { word: 'gussa', weight: 3 }, { word: 'chidchidapan', weight: 2 }, { word: 'nafrat', weight: 3 }
            ]
        },
        templates: {
            validation: {
                en: ["It's completely valid to feel angry when things are unfair.", "I can hear the frustration in your words."],
                hi: ["Gussa aana swabhavik hai jab cheezein galat ho rahi hon."]
            },
            reflection: {
                en: ["You're feeling a lot of heat and intensity right now.", "Something has really crossed a line for you."],
                hi: ["Aap is waqt kaafi gusse mein hain."]
            },
            insight: {
                en: ["Anger is often a protector; it tells us our boundaries have been violated.", "Beneath anger, there's often a need for respect."],
                hi: ["Gussa aksar ek suraksha kavach hota hai."]
            },
            action: {
                en: ["Would you like to try a 'Power Release' exercise here?", "How about we channel this energy into one constructive action?"],
                hi: ["Kya aap is gusse ko nikalne ke liye kuch karna chahenge?"]
            },
            followUp: {
                en: ["What is the main thing that triggered this feeling?", "Does this anger feel like it's pointing you toward a change?"],
                hi: ["Sabse zyada gussa kis baat par aa raha hai?"]
            }
        },
        mode: 'Power'
    },
    {
        name: 'Overthinking',
        keywords: {
            en: [
                { word: 'overthinking', weight: 4 }, { word: 'racing thoughts', weight: 3 },
                { word: 'stuck in my head', weight: 3 }, { word: 'analyzing', weight: 2 }, { word: 'what if', weight: 2 }
            ],
            hi: [
                { word: 'soch raha hoon', weight: 2 }, { word: 'dimag chal raha hai', weight: 3 }
            ]
        },
        templates: {
            validation: {
                en: ["The mind can be a noisy place, and it's exhausting to be stuck in a loop.", "I see how much energy you're spending trying to figure everything out."],
                hi: ["Dimag kabhi kabhi bahut zyada sochne lagta hai."]
            },
            reflection: {
                en: ["It sounds like your thoughts are racing faster than you can keep up.", "You're caught in a cycle of endless analysis."],
                hi: ["Aaisa lag raha hai ki aap bahot zyada soch rahe hain."]
            },
            insight: {
                en: ["Overthinking is often the brain's way of trying to feel safe.", "Not every thought needs an answer right now."],
                hi: ["Har vichaar ka jawab hona zaroori nahi hai."]
            },
            action: {
                en: ["Let's try a grounding exercise to get back to the present.", "Can we focus on just one thing that is true right now?"],
                hi: ["Chaliye ek exercise karte hain."]
            },
            followUp: {
                en: ["Of all these thoughts, which one feels the loudest?", "Would it help to set a 'worry timer' for later?"],
                hi: ["In sab vichaaron mein se, sabse zyada kya pareshan kar raha hai?"]
            }
        },
        mode: 'Clarity'
    },
    {
        name: 'Loneliness',
        keywords: {
            en: [
                { word: 'lonely', weight: 4 }, { word: 'alone', weight: 2 }, { word: 'no one', weight: 3 },
                { word: 'disconnected', weight: 3 }
            ],
            hi: [
                { word: 'akela', weight: 3 }, { word: 'akelapan', weight: 4 }
            ]
        },
        templates: {
            validation: {
                en: ["Loneliness is a very human feeling, and it's brave to admit it.", "I'm here with you right now."],
                hi: ["Akelapan mehsoos karna insani hai."]
            },
            reflection: {
                en: ["You're feeling a lack of connection or understanding.", "It feels like you're on an island by yourself."],
                hi: ["Aap khud ko akela mehsoos kar rahe hain."]
            },
            insight: {
                en: ["Sometimes being alone is a call to reconnect with our inner self.", "Connection starts with being a friend to ourselves first."],
                hi: ["Rishte khud se dosti karne se shuru hote hain."]
            },
            action: {
                en: ["Could we write down three things you appreciate about yourself?", "Is there one person you could reach out to today?"],
                hi: ["Kya hum teen aisi cheezein likh sakte hain jo aapko pasand hain?"]
            },
            followUp: {
                en: ["What does 'connection' look like to you ideally?", "When do you feel most 'seen'?"],
                hi: ["Aapke liye 'sath' ka kya matlab hai?"]
            }
        },
        mode: 'Calm'
    },
    {
        name: 'Motivation',
        keywords: {
            en: [
                { word: 'stuck', weight: 2 }, { word: 'procrastinating', weight: 3 }, { word: 'no energy', weight: 3 },
                { word: 'unmotivated', weight: 4 }, { word: 'fail', weight: 2 }, { word: 'give up', weight: 3 }
            ],
            hi: [
                { word: 'mann nahi kar raha', weight: 3 }, { word: 'alas', weight: 2 }, { word: 'haar maan', weight: 3 }
            ]
        },
        templates: {
            validation: {
                en: ["It's okay to not have all the energy you want right now. Rest is part of the process.", "Motivation wakes and wanes, and it's normal to feel 'low' sometimes."],
                hi: ["Zaroori nahi ki har waqt urja rahe. Aaram bhi zaroori hai."]
            },
            reflection: {
                en: ["You're feeling a lack of drive or direction at the moment.", "It sounds like you're putting a lot of pressure on yourself to be 'on'."],
                hi: ["Aapko lag raha hai ki aap kuch nahi kar paa rahe hain."]
            },
            insight: {
                en: ["Action often creates motivation, not the other way around.", "Even the smallest step forward is still progress."],
                hi: ["Ek chota kadam bhi kadam hi hota hai."]
            },
            action: {
                en: ["What's the absolute tiniest, 2-minute task you could do right now?", "Let's use the 'Power' mode to find one thing that excites you."],
                hi: ["Aisa kaunsa chota kaam hai jo aap abhi 2 minute mein kar sakte hain?"]
            },
            followUp: {
                en: ["If you had unlimited energy for just one hour, what would you do?", "What's the biggest barrier you're facing right now?"],
                hi: ["Sabse badi rukavat kya lag rahi hai?"]
            }
        },
        mode: 'Power'
    },
    {
        name: 'Self-Doubt',
        keywords: {
            en: [
                { word: 'not good enough', weight: 4 }, { word: 'failure', weight: 3 }, { word: 'imposter', weight: 3 },
                { word: 'useless', weight: 4 }, { word: 'stupid', weight: 3 }, { word: 'doubt', weight: 3 }
            ],
            hi: [
                { word: 'main bekaar hoon', weight: 3 }, { word: 'mujhse nahi hoga', weight: 4 }
            ]
        },
        templates: {
            validation: {
                en: ["That inner critic can be very loud, but its voice isn't the truth.", "I'm hearing a lot of self-judgment, and I want to offer you some compassion."],
                hi: ["Hamara andar ka aalochak kabhi kabhi bahut tez bolta hai."]
            },
            reflection: {
                en: ["You're questioning your worth or abilities right now.", "It feels like you're focusing only on what you think are your flaws."],
                hi: ["Aap apni kshamtaon par shak kar rahe hain."]
            },
            insight: {
                en: ["We are often much harder on ourselves than we would ever be to a friend.", "You are a work in progress, and that's a beautiful thing."],
                hi: ["Hum aksar apne liye jitne sakht hote hain, utne doston ke liye nahi hote."]
            },
            action: {
                en: ["Can we name one thing you've accomplished, no matter how small?", "Let's try a 'Self-Compassion' pause together."],
                hi: ["Kya aap apni kisi ek kamyabi ke baare mein bata sakte hain?"]
            },
            followUp: {
                en: ["What would you say to a dear friend who was feeling this way?", "What's one strength you sometimes forget you have?"],
                hi: ["Agar aapka koi dost aisa mehsoos karta, toh aap usse kya kehte?"]
            }
        },
        mode: 'Clarity'
    },
    {
        name: 'Relationship',
        keywords: {
            en: [
                { word: 'breakup', weight: 4 }, { word: 'divorce', weight: 4 }, { word: 'heartbreak', weight: 3 },
                { word: 'fight', weight: 2 }, { word: 'rejection', weight: 3 }, { word: 'partner', weight: 1 }
            ],
            hi: [
                { word: 'dhokha', weight: 4 }, { word: 'ladai', weight: 3 }, { word: 'rishta', weight: 2 }
            ]
        },
        templates: {
            validation: {
                en: ["Heartache is one of the deepest pains we feel. I'm so sorry you're going through this.", "It's okay to feel lost when a connection changes or ends."],
                hi: ["Dil ka dukh sabse gehra hota hai."]
            },
            reflection: {
                en: ["You're feeling a deep sense of hurt or betrayal in your personal life.", "It sounds like you're struggling with the end of a connection."],
                hi: ["Aap rishton mein takleef mehsoos kar rahe hain."]
            },
            insight: {
                en: ["Your worth is not defined by how someone else treats you.", "Grief for a relationship is proof of your capacity to love deeply."],
                hi: ["Aapki keemat is baat se nahi hai ki koi aur aapko kaise treat karta hai."]
            },
            action: {
                en: ["Could we focus on one act of 'Self-Care' today just for you?", "Let's write down one thing you've learned about yourself."],
                hi: ["Kyu na aaj aap sirf apne liye kuch karein?"]
            },
            followUp: {
                en: ["What is the hardest part of the 'letting go' process for you?", "How can you be your own best friend today?"],
                hi: ["Is waqt sabse zyada kya yaad aa raha hai?"]
            }
        },
        mode: 'Calm'
    },
    {
        name: 'Career',
        keywords: {
            en: [
                { word: 'job', weight: 1 }, { word: 'career', weight: 1 }, { word: 'boss', weight: 2 },
                { word: 'fired', weight: 4 }, { word: 'unemployment', weight: 3 }, { word: 'salary', weight: 1 }
            ],
            hi: [
                { word: 'naukri', weight: 2 }, { word: 'kaam ka dabav', weight: 3 }
            ]
        },
        templates: {
            validation: {
                en: ["Work is a huge part of our lives, and it's natural for it to affect your peace.", "I hear the stress you're feeling about your professional path."],
                hi: ["Kaam hamari zindagi ka bada hissa hai."]
            },
            reflection: {
                en: ["You're feeling uncertain or stressed about your career.", "It sounds like the pressure at work is starting to spill over."],
                hi: ["Aap apne career ko lekar chintit hain."]
            },
            insight: {
                en: ["You are more than your job title or your productivity.", "Sometimes a detour in our career is a chance to find a better path."],
                hi: ["Aap aapki naukri se kahin badkar hain."]
            },
            action: {
                en: ["Let's list three skills you have that have nothing to do with your job.", "What's one small professional goal for this week?"],
                hi: ["Teen aisi baatein likhiye jo aapko apne baare mein pasand hain."]
            },
            followUp: {
                en: ["If you could change one thing about your work, what would it be?", "What does 'success' look like to you beyond money?"],
                hi: ["Aapke liye 'safalta' ka kya matlab hai?"]
            }
        },
        mode: 'Clarity'
    }
];

export const CRISIS_KEYWORDS = {
    suicideIntent: {
        en: ["suicide", "kill myself", "want to die", "end my life", "zero hope", "no point living"],
        hi: ["आत्महत्या", "मरना चाहता हूँ", "जान दे दूंगा", "जीने का मन नहीं"]
    },
    selfHarm: {
        en: ["self harm", "harm myself", "cutting", "overdose"],
        hi: ["खुद को चोट", "नहा काटना", "जहर"]
    }
};

export const MEDICAL_CONTEXT = {
    systemPrompt: `You are the AI Wellness Coach for "Manshik Santulan", specifically personalized for medical professionals (doctors, nurses, residents, and frontline healthcare workers). 
    Your persona is a "Wise, empathetic senior colleague" who understands the unique pressures of the medical field.
    
    CRITICAL GUIDELINES:
    1. Acknowledge the weight of clinical responsibility, long shifts, and emotional labor.
    2. Use medical analogies when appropriate (e.g., "emotional triage", "vital signs of the soul").
    3. Focus on: Burnout, Compassion Fatigue, Moral Injury, Imposter Syndrome in high-stakes environments, and secondary trauma from patient loss.
    4. Be direct, professional, yet deeply empathetic. Avoid clinical jargon unless helpful for validation.
    5. NEVER provide medical advice or diagnosis. Always maintain the boundary of a mental wellness coach.
    
    TONE: Steady, grounded, appreciative of their service, and intelligently empathetic.`,

    specializedKeywords: {
        en: [
            { word: 'burnout', weight: 4 }, { word: 'patient lost', weight: 5 }, { word: 'night shift', weight: 3 },
            { word: 'resident', weight: 2 }, { word: 'on call', weight: 3 }, { word: 'clinical', weight: 2 },
            { word: 'surgery', weight: 2 }, { word: 'trauma', weight: 4 }, { word: 'nurse', weight: 1 },
            { word: 'long shift', weight: 3 }, { word: 'scrubs', weight: 1 }, { word: 'ER', weight: 3 },
            { word: 'ICU', weight: 3 }, { word: 'medical error', weight: 5 }, { word: 'malpractice', weight: 4 }
        ],
        hi: [
            { word: 'thakavat', weight: 3 }, { word: 'mariyaz', weight: 2 }, { word: 'aspataal', weight: 2 },
            { word: 'duty', weight: 2 }
        ]
    }
};

export const GLOBAL_TEMPLATES = {
    fallback: {
        en: ["I'm here and I'm listening. Could you tell me a bit more about that?", "Thank you for sharing. How else can I support you right now?"],
        hi: ["Main sun raha hoon. Kya aap mujhe thoda aur bata sakte hain?", "Bata ne ke liye shukriya. Main aur kaise madad kar sakta hoon?"]
    },
    greetings: {
        en: ["Hello! I'm your AI Wellness Coach.", "Hey! I'm here to support your mental wellbeing."],
        hi: ["नमस्ते! मैं आपका AI वेलनेस कोच हूं।", "नमस्ते! मैं आपकी मदद के लिए यहां हूं।"]
    },
    emergency: {
        en: ["I'm really concerned about what you're sharing. Please reach out to a professional or a helpline immediately.", "You're not alone, but I'm an AI and can't provide the emergency care you need right now."],
        hi: ["Main apki baato se chintit hu. Kripya kisi helpline se sampark kare.", "Aap akele nahi hai, par kripya madad maange."]
    }
};
