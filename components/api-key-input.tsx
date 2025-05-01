"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Check, Copy, Key } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiKeyInputProps {
  onSave?: (key: string) => void
  className?: string
  label?: string
  placeholder?: string
  buttonText?: string
  successMessage?: string
}

export default function ApiKeyInput({
  onSave,
  className,
  label = "API Key",
  placeholder = "Paste your API key here",
  buttonText = "Save Key",
  successMessage = "API key saved successfully!",
}: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleSave = () => {
    if (!apiKey.trim()) return

    if (onSave) {
      onSave(apiKey)
    }

    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 3000)
  }

  const handleCopy = () => {
    if (!apiKey.trim()) return

    navigator.clipboard.writeText(apiKey)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-medium">{label}</h3>
      </div>

      <div className="relative">
        <Input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={placeholder}
          className="pr-20 bg-white/90 dark:bg-gray-800/90 border-yellow-200 dark:border-yellow-800 focus:border-yellow-500 focus:ring-yellow-500"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          className={cn(
            "flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-yellow-500/20 active:scale-[0.98] relative overflow-hidden group",
            isSaved && "bg-green-600 hover:bg-green-700",
          )}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative z-10 flex items-center">
            {isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {successMessage}
              </>
            ) : (
              buttonText
            )}
          </span>
        </Button>

        {apiKey && (
          <Button
            onClick={handleCopy}
            variant="outline"
            className="border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
