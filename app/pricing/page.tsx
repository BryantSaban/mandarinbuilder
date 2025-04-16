"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X } from "lucide-react"
import PageLayout from "@/components/page-layout"

interface PricingTierProps {
  name: string
  price: string
  description: string
  features: {
    included: string[]
    excluded: string[]
  }
  buttonText: string
  buttonLink: string
  highlighted?: boolean
}

function PricingTier({
  name,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
}: PricingTierProps) {
  return (
    <div
      className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
        highlighted
          ? "border-yellow-400 dark:border-yellow-500 transform scale-105"
          : "border-white/10 dark:border-gray-700"
      }`}
    >
      {highlighted && <div className="bg-yellow-500 text-white text-center py-1 text-sm font-medium">Most Popular</div>}

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{price}</span>
          {price !== "Free" && <span className="text-gray-600 dark:text-gray-400">/month</span>}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

        <div className="space-y-3 mb-6">
          {features.included.map((feature, index) => (
            <div key={`included-${index}`} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}

          {features.excluded.map((feature, index) => (
            <div key={`excluded-${index}`} className="flex items-center text-gray-400 dark:text-gray-500">
              <X className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Link href={buttonLink}>
          <Button
            className={`w-full ${
              highlighted
                ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <PageLayout backgroundImage="/images/learn-bg.webp">
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col relative z-10">
        <Link href="/" className="inline-block mb-6">
          <Button variant="outline" className="bg-black/30 border-white/20 text-white hover:bg-black/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Choose Your Plan</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Select the perfect plan for your Mandarin learning journey. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingTier
            name="Free"
            price="Free"
            description="Perfect for beginners just starting their Mandarin journey."
            features={{
              included: [
                "Basic vocabulary flashcards",
                "5 daily practice sentences",
                "Community forum access",
                "Progress tracking",
              ],
              excluded: [
                "Advanced grammar lessons",
                "Conversation practice with AI",
                "Personalized learning path",
                "Premium backgrounds",
              ],
            }}
            buttonText="Get Started"
            buttonLink="/signup"
          />

          <PricingTier
            name="Premium"
            price="$9.99"
            description="The ideal choice for serious language learners."
            features={{
              included: [
                "Everything in Free",
                "Unlimited vocabulary flashcards",
                "Advanced grammar lessons",
                "Conversation practice with AI",
                "Personalized learning path",
              ],
              excluded: ["Premium backgrounds", "Priority support"],
            }}
            buttonText="Choose Premium"
            buttonLink="/signup?plan=premium"
            highlighted={true}
          />

          <PricingTier
            name="Ultimate"
            price="$19.99"
            description="The complete package for mastering Mandarin."
            features={{
              included: [
                "Everything in Premium",
                "Premium backgrounds",
                "Priority support",
                "Offline mode",
                "Pronunciation analysis",
                "Writing practice",
                "1-on-1 tutor sessions (monthly)",
              ],
              excluded: [],
            }}
            buttonText="Choose Ultimate"
            buttonLink="/signup?plan=ultimate"
          />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Can I change plans later?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next
                billing cycle.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Is there a refund policy?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We offer a 14-day money-back guarantee if you're not satisfied with your premium subscription.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Do you offer student discounts?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes! Students can get 20% off any plan. Contact our support team with your student ID for verification.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">How do the tutor sessions work?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ultimate plan members get one 30-minute session per month with a native Mandarin speaker via video call.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
