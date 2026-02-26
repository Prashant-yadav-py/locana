"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, Send, Sparkles, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function VoiceChatPage() {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your Locana voice assistant. You can tell me to update stock, add products, or ask about inventory. Try saying "Add 10 Maggie packets" or "Check bread stock".',
      timestamp: Date.now()
    }])
  }, [])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await processAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      alert("Microphone access denied")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')

      const transcriptRes = await fetch('/api/openai/whisper', {
        method: 'POST',
        body: formData
      })
      const { text } = await transcriptRes.json()
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: text,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, userMessage])

      const updateRes = await fetch('/api/openai/stock-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, method: 'voice' })
      })
      const result = await updateRes.json()
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.message || "Stock updated successfully!",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, assistantMessage])

      const utterance = new SpeechSynthesisUtterance(result.message || "Stock updated")
      utterance.lang = 'hi-IN'
      speechSynthesis.speak(utterance)
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20 flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Locana Assistant</h1>
            <p className="text-xs text-muted-foreground">Voice-powered inventory</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : 'bg-card border border-border/50 mr-12'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {mounted && (
                <p className={`text-xs mt-1 opacity-70 ${
                  message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 mr-12">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-muted-foreground">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Input */}
      <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
        <div className="flex items-center justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isRecording
                ? 'bg-destructive hover:bg-destructive/90 scale-110 shadow-lg shadow-destructive/25'
                : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Mic className="w-6 h-6 text-primary-foreground" />
            )}
          </Button>
        </div>
        
        <div className="text-center mt-3">
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
          </p>
          {!isRecording && !isProcessing && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              Try: "Add 10 Maggie" or "Check bread stock"
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
