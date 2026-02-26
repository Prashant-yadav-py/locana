"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Camera, Upload, Image } from "lucide-react"

interface ImageUpdateModalProps {
  onClose: () => void
}

export function ImageUpdateModal({ onClose }: ImageUpdateModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageSelect(file)
  }

  const processImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      // GPT-4 Vision API - Analyze image and extract product info
      const response = await fetch('/api/openai/image-analysis', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()

      if (result.success) {
        setResult(result.message)
      } else {
        setResult("Failed to process image")
      }
    } catch (error) {
      setResult("Error processing image")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Image Update</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {!selectedImage ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload product image, bill, or product list
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    
                    <Button
                      onClick={() => {
                        // Camera capture would need additional setup
                        fileInputRef.current?.click()
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Product images: AI will identify and add to inventory</p>
                  <p>• Bills/Receipts: AI will extract all items and quantities</p>
                  <p>• Product lists: AI will parse and update stock</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null)
                      setPreview("")
                      setResult("")
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {result && (
                  <div className="p-3 bg-green-100 rounded-lg">
                    <p className="text-sm font-medium mb-2">AI Analysis Result:</p>
                    <p className="text-sm">{result}</p>
                  </div>
                )}

                <Button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Processing Image..." : "Analyze & Update Stock"}
                </Button>
              </div>
            )}
          </div>
                              
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  )
}