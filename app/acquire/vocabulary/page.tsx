"use client"

import { useState, useEffect } from "react"
import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ChevronDown, FolderPlus, Library, Tag, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import Flashcard from "@/components/flashcard"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample flashcard data
const sampleCards = [
  {
    front: "你好",
    back: "Hello",
    pinyin: "nǐ hǎo",
    examples: [
      "你好，我叫李明。 (Hello, my name is Li Ming.)",
      "早上好，你好吗？ (Good morning, how are you?)",
      "你好！很高兴认识你。 (Hello! Nice to meet you.)",
    ],
  },
  {
    front: "谢谢",
    back: "Thank you",
    pinyin: "xiè xiè",
    examples: [
      "谢谢你的帮助。 (Thank you for your help.)",
      "非常谢谢！ (Thank you very much!)",
      "谢谢你的礼物。 (Thank you for your gift.)",
    ],
  },
  {
    front: "再见",
    back: "Goodbye",
    pinyin: "zài jiàn",
    examples: [
      "明天见，再见！ (See you tomorrow, goodbye!)",
      "再见，祝你有美好的一天。 (Goodbye, have a nice day.)",
      "我要走了，再见。 (I have to go, goodbye.)",
    ],
  },
  {
    front: "对不起",
    back: "Sorry",
    pinyin: "duì bù qǐ",
    examples: [
      "对不起，我迟到了。 (Sorry, I'm late.)",
      "对不起，我不明白。 (Sorry, I don't understand.)",
      "如果我错了，对不起。 (If I'm wrong, I'm sorry.)",
    ],
  },
  {
    front: "没关系",
    back: "It's okay / No problem",
    pinyin: "méi guān xì",
    examples: [
      "没关系，我不介意等。 (It's okay, I don't mind waiting.)",
      "你迟到了，但没关系。 (You're late, but it's no problem.)",
      "没关系，我们可以明天再试。 (No problem, we can try again tomorrow.)",
    ],
  },
]

// Sample decks
const sampleDecks = [
  { id: "1", name: "Basics", cardCount: 42 },
  { id: "2", name: "Greetings", cardCount: 15 },
  { id: "3", name: "Food & Dining", cardCount: 28 },
  { id: "4", name: "Travel", cardCount: 35 },
]

// Sample topics
const sampleTopics = [
  { id: "1", name: "Ordering Food", cardCount: 24 },
  { id: "2", name: "Conversation Starters", cardCount: 18 },
  { id: "3", name: "Comforting People", cardCount: 12 },
  { id: "4", name: "Job Interviews", cardCount: 30 },
  { id: "5", name: "Shopping", cardCount: 22 },
  { id: "6", name: "Transportation", cardCount: 16 },
  { id: "7", name: "Emergency Situations", cardCount: 14 },
  { id: "8", name: "Weather Discussions", cardCount: 10 },
  { id: "9", name: "Family Relationships", cardCount: 20 },
  { id: "10", name: "Hobbies & Interests", cardCount: 25 },
  { id: "11", name: "Academic Vocabulary", cardCount: 35 },
  { id: "12", name: "Business Meetings", cardCount: 28 },
]

export default function VocabularyPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDeck, setCurrentDeck] = useState(sampleDecks[0])

  // Filter topics based on search query
  const filteredTopics = sampleTopics.filter((topic) => topic.name.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen flex flex-col relative bg-transparent dark:bg-transparent text-gray-900 dark:text-white">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 opacity-40 dark:opacity-20"
        style={{ backgroundImage: "url('/images/acquire-bg.webp')" }}
      />

      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Content */}
      <div
        className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center relative z-10 transition-opacity duration-800 hide-ui-fade"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div className="w-full max-w-5xl">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-blue-100 dark:border-blue-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Vocabulary Flashcards</h1>
                <p className="text-gray-600 dark:text-gray-300">Master new words with spaced repetition</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Topics Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Topics
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
                    <DropdownMenuLabel>Common Conversation Topics</DropdownMenuLabel>
                    <div className="px-2 py-2">
                      <Input
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <DropdownMenuSeparator />
                    {filteredTopics.length > 0 ? (
                      filteredTopics.map((topic) => (
                        <DropdownMenuItem key={topic.id} className="cursor-pointer">
                          <span>{topic.name}</span>
                          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            {topic.cardCount} cards
                          </span>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-gray-500 dark:text-gray-400">
                        No topics found matching "{searchQuery}"
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Deck Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Library className="mr-2 h-4 w-4" />
                      Decks
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Current Deck: {currentDeck.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {sampleDecks.map((deck) => (
                        <DropdownMenuItem key={deck.id} className="cursor-pointer" onClick={() => setCurrentDeck(deck)}>
                          <span>{deck.name}</span>
                          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            {deck.cardCount} cards
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-blue-600 dark:text-blue-400">
                      <FolderPlus className="mr-2 h-4 w-4" />
                      <span>Create New Deck</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Current Deck Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8 border border-blue-100 dark:border-blue-900 flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">{currentDeck.name} Deck</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentDeck.cardCount} cards total • 15 due today
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-1 h-4 w-4" />
              Add Card
            </Button>
          </div>

          {/* Flashcard Section */}
          <div className="flex justify-center mb-8">
            <Flashcard cards={sampleCards} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-blue-600 dark:text-blue-400">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Cards Reviewed</span>
                    <span className="font-medium text-gray-900 dark:text-white">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">New Words Learned</span>
                    <span className="font-medium text-gray-900 dark:text-white">3</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={{ width: "40%" }} />
                  </div>
                  <p className="text-xs text-right text-gray-500 dark:text-gray-400">40% of daily goal</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-blue-600 dark:text-blue-400">Upcoming Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Due Tomorrow</span>
                    <span className="font-medium text-gray-900 dark:text-white">12 cards</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">New Available</span>
                    <span className="font-medium text-gray-900 dark:text-white">8 cards</span>
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
                    Next review batch available in 3 hours
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-blue-600 dark:text-blue-400">Mastery Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Current Level</span>
                    <span className="font-medium text-gray-900 dark:text-white">Beginner - Level 2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Words in Collection</span>
                    <span className="font-medium text-gray-900 dark:text-white">42</span>
                  </div>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-700 dark:text-green-300">
                    10 more words until Level 3
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-between px-8 z-20 hide-ui-fade">
        {/* Back button */}
        <Link href="/acquire">
          <Button
            variant="outline"
            className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Acquire
          </Button>
        </Link>

        {/* Next Page button */}
        <Link href="/learn">
          <Button
            variant="outline"
            className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Next to Learn
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  )
}
