"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageLayout from "@/components/page-layout"
import ApiKeyInput from "@/components/api-key-input"

export default function ApiKeysPage() {
  const [isKeySet, setIsKeySet] = useState(false)

  const handleSaveKey = (key: string) => {
    console.log("API key saved:", key)
    // In a real application, you would securely store this key
    // or send it to your backend to be stored
    setIsKeySet(true)
  }

  return (
    <PageLayout backgroundImage="/images/journey-bg-chinese.png">
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          <Link href="/" className="inline-block mb-6">
            <Button variant="outline" className="bg-black/30 border-white/20 text-white hover:bg-black/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">API Keys</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Manage your API keys for various services used by Mandarin Builder
            </p>

            <div className="space-y-8">
              <ApiKeyInput
                label="Mandarin Builder API Key"
                placeholder="Paste your MANDARINBUILDER_API_KEY here"
                onSave={handleSaveKey}
              />

              {isKeySet && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200">
                    Your API key has been successfully saved and will be used for text-to-speech and other services.
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-yellow-800 dark:text-yellow-300 font-medium mb-2">Security Note</h3>
                <p className="text-yellow-700 dark:text-yellow-200 text-sm">
                  Your API key is stored securely and is only used to authenticate requests to the Mandarin Builder
                  services. Never share your API key with others or expose it in client-side code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
