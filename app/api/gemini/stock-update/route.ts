import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA3BlZJnAG02Ial6u6xb1z_p3uQkrleE6k'

export async function POST(request: NextRequest) {
  try {
    const { transcript, language } = await request.json()

    const prompts = {
      hinglish: `You are a friendly Indian shop stock assistant. User said: "${transcript}". 
Understand the product and action (add/update/low stock/out of stock). 
Respond in natural Hinglish (Hindi-English mix) like: "Haan bhai! Maggie ka stock add kar diya. Kuch aur?"
Keep it very short, friendly and conversational. Use words like: theek hai, haan, bilkul, aur kuch.`,
      hindi: `आप एक दुकान के स्टॉक असिस्टेंट हैं। यूजर ने कहा: "${transcript}"। 
प्रोडक्ट और एक्शन समझें। बहुत छोटा और दोस्ताना जवाब दें। 
जैसे: "ठीक है! Maggie का स्टॉक ऐड कर दिया। कुछ और?"`,
      english: `You are a friendly shop stock assistant. User said: "${transcript}". 
Understand product and action. Respond very briefly and friendly like: "Got it! Added Maggie to stock. Anything else?"`
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompts[language as keyof typeof prompts] || prompts.hinglish
            }]
          }]
        })
      }
    )

    const data = await response.json()
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Theek hai! Stock update ho gaya.'
    
    // Clean up response - remove extra formatting
    aiResponse = aiResponse.replace(/\*\*/g, '').replace(/\*/g, '').trim()

    return NextResponse.json({
      success: true,
      message: aiResponse
    })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing request'
    }, { status: 500 })
  }
}
