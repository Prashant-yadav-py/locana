import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Return success - Speech recognition handled by browser
    return NextResponse.json({ 
      text: 'Voice processed successfully',
      success: true 
    })
  } catch (error) {
    console.error('Whisper API error:', error)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}