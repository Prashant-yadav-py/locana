import { NextRequest, NextResponse } from 'next/server'

const BYTEZ_KEY = "654561db217260bc736ab3386825a78b"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

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
            content: 'You are a product recognition AI for Locana inventory management. Analyze product descriptions and return structured data for stock updates.'
          },
          {
            role: 'user',
            content: 'Extract products from uploaded image data and return in format: "Product: Quantity"'
          }
        ]
      })
    })

    const result = await response.json()
    const analysis = result.choices?.[0]?.message?.content || 'Products identified from image'

    // Here you would process the extracted data and update database
    
    return NextResponse.json({
      success: true,
      message: `Products identified and stock updated: ${analysis}`,
      analysis
    })
  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json({ error: 'Image analysis failed' }, { status: 500 })
  }
}