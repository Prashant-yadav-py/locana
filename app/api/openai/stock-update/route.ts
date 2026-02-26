import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { transcript, productName, quantity, method } = await request.json()

    let prompt = ""
    if (method === 'voice') {
      prompt = `
        Analyze this voice command: "${transcript}"
        Extract product name and quantity. Handle Hindi/English mix.
        Examples: "Maggie stock me add kro" = Add Maggie to stock
        "Bread 10 pieces add kro" = Add 10 Bread to stock
        
        Return JSON: {"product": "name", "quantity": number, "action": "add/remove"}
      `
    } else {
      prompt = `
        Process stock update for: ${productName}, quantity: ${quantity}
        Check if product exists in database, update stock accordingly.
        Return success message.
      `
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a stock management AI for Locana app. Process stock updates and return structured responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })

    const aiResponse = completion.choices[0].message.content || 'Stock updated successfully'

    // Here you would integrate with your database
    // For now, returning mock success response
    
    return NextResponse.json({
      success: true,
      message: method === 'voice' 
        ? aiResponse
        : `Added ${quantity || 1} ${productName} to stock successfully!`,
      aiResponse
    })
  } catch (error) {
    console.error('Stock update error:', error)
    return NextResponse.json({ error: 'Stock update failed' }, { status: 500 })
  }
}