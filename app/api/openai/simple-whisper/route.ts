import { NextRequest, NextResponse } from 'next/server'

const BYTEZ_KEY = "654561db217260bc736ab3386825a78b"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // Simple text processing for voice commands
    const response = await fetch('https://api.bytez.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BYTEZ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: 'Convert voice commands to stock updates. Handle Hindi/English mix. Extract product and quantity.'
          },
          {
            role: 'user',
            content: `Process this voice command: "${text}"`
          }
        ]
      })
    })

    const result = await response.json()
    const processedText = result.choices?.[0]?.message?.content || text

    return NextResponse.json({ text: processedText })
  } catch (error) {
    console.error('Voice processing error:', error)
    return NextResponse.json({ error: 'Voice processing failed' }, { status: 500 })
  }
}