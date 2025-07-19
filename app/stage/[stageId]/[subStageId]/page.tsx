"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getSubStageById } from "@/lib/phrases"
import { AISpeakingPractice } from "@/components/ui/ai-speaking-practice"
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Home
} from "lucide-react"

export default function SubStagePage() {
  const router = useRouter()
  const params = useParams()
  const stageId = params.stageId as string
  const subStageId = params.subStageId as string
  
  const subStage = getSubStageById(stageId, subStageId)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set())
  
  if (!subStage) {
    return <div>サブステージが見つかりません</div>
  }

  const currentPhrase = subStage.phrases[currentPhraseIndex]
  const progress = (completedPhrases.size / subStage.phrases.length) * 100
  const isCompleted = completedPhrases.size === subStage.phrases.length

  const handleBack = () => {
    router.push(`/stage/${stageId}`)
  }

  const handleHome = () => {
    router.push('/')
  }

  const handlePhraseComplete = () => {
    const newCompleted = new Set(completedPhrases)
    newCompleted.add(currentPhraseIndex)
    setCompletedPhrases(newCompleted)
  }

  const handleNextPhrase = () => {
    if (currentPhraseIndex < subStage.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1)
    }
  }

  const handlePrevPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1)
    }
  }

  const handlePhraseSelect = (index: number) => {
    setCurrentPhraseIndex(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Button 
          onClick={handleBack}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
        
        <Button 
          onClick={handleHome}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Home className="w-4 h-4" />
        </Button>
      </header>

      {/* Progress Section */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-white">{subStage.title}</h1>
              <span className="text-white/80 text-sm">
                {completedPhrases.size}/{subStage.phrases.length}
              </span>
            </div>
            <Progress value={progress} className="bg-white/20" />
            <p className="text-white/80 text-sm">{subStage.description}</p>
          </div>
        </Card>
      </div>

      {/* Phrase Navigation */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex flex-wrap gap-2">
            {subStage.phrases.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePhraseSelect(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  index === currentPhraseIndex
                    ? 'bg-blue-500 text-white'
                    : completedPhrases.has(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
              >
                {completedPhrases.has(index) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-20">
        {isCompleted ? (
          /* Completion Screen */
          <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white/20 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">おめでとうございます！</h2>
              <p className="text-white/90">
                「{subStage.title}」をクリアしました！
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  onClick={handleBack}
                  variant="secondary"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  ステージに戻る
                </Button>
                <Button
                  onClick={handleHome}
                  variant="secondary"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  ホームに戻る
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* Practice Screen */
          <div className="space-y-6">
            {/* Current Phrase Info */}
            <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-center">
                <span className="text-white/80 text-sm">
                  フレーズ {currentPhraseIndex + 1} / {subStage.phrases.length}
                </span>
                {completedPhrases.has(currentPhraseIndex) && (
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-400 text-sm">クリア済み</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Phrase Display */}
            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">{currentPhrase.text}</h2>
                <p className="text-lg text-blue-200">{currentPhrase.phonetic}</p>
                <p className="text-lg text-yellow-200">{currentPhrase.katakana}</p>
              </div>
            </Card>

            {/* Pronunciation Practice */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm border border-white/20">
              <AISpeakingPractice
                targetText={currentPhrase.text}
                targetMeaning={currentPhrase.katakana}
                onComplete={(score) => {
                  console.log('Phrase completed with score:', score)
                  handlePhraseComplete()
                  // 自動的に次のフレーズに進む
                  setTimeout(() => {
                    if (currentPhraseIndex < subStage.phrases.length - 1) {
                      handleNextPhrase()
                    }
                  }, 2000)
                }}
                onIncorrect={() => {
                  console.log('Pronunciation incorrect, allowing retry')
                }}
                onNextQuestion={() => {
                  if (currentPhraseIndex < subStage.phrases.length - 1) {
                    handleNextPhrase()
                  }
                }}
              />
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevPhrase}
                disabled={currentPhraseIndex === 0}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                前へ
              </Button>

              <Button
                onClick={handleNextPhrase}
                disabled={currentPhraseIndex === subStage.phrases.length - 1}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
              >
                次へ
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 