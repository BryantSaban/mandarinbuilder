"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  voiceChatEnabled: boolean
  setVoiceChatEnabled: (enabled: boolean) => void
  selectedVoice?: string
  setSelectedVoice?: (voice: string) => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  voiceChatEnabled,
  setVoiceChatEnabled,
  selectedVoice = "alloy",
  setSelectedVoice = () => {},
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Conversation Settings</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="voice-chat-mode" className="text-base font-medium">
                Voice Chat Mode
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable speaking and listening practice with voice input
              </p>
            </div>
            <Switch
              id="voice-chat-mode"
              checked={voiceChatEnabled}
              onCheckedChange={setVoiceChatEnabled}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-pinyin" className="text-base font-medium">
                Show Pinyin
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Display pinyin pronunciation above Chinese characters
              </p>
            </div>
            <Switch id="show-pinyin" defaultChecked={true} className="data-[state=checked]:bg-purple-600" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-correct" className="text-base font-medium">
                Auto-Correction
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically correct common pronunciation mistakes
              </p>
            </div>
            <Switch id="auto-correct" defaultChecked={true} className="data-[state=checked]:bg-purple-600" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-selection" className="text-base font-medium">
              Voice Selection
            </Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger id="voice-selection" className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy (Balanced)</SelectItem>
                <SelectItem value="echo">Echo (Male)</SelectItem>
                <SelectItem value="fable">Fable (Youthful)</SelectItem>
                <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
                <SelectItem value="nova">Nova (Female)</SelectItem>
                <SelectItem value="shimmer">Shimmer (Friendly Female)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose the voice for audio responses</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="speech-recognition-language" className="text-base font-medium">
              Speech Recognition Language
            </Label>
            <Select defaultValue="zh-CN">
              <SelectTrigger id="speech-recognition-language" className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">Chinese (Mandarin)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">Language for voice input recognition</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
