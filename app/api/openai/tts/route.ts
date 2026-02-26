import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // Return success - TTS handled by browser's speechSynthesis
    return NextResponse.json({ 
      success: true, 
      message: 'Use browser TTS instead' 
    })
  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 })
  }
}