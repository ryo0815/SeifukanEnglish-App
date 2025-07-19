"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { stages } from "@/lib/phrases"
import { 
  Shield, 
  Sword, 
  Star,
  ArrowDown,
  Play,
  Lock
} from "lucide-react"

export default function Home() {
  const router = useRouter()

  const stageIcons = {
    'stage-0': Shield,
    'stage-1': Sword,
    'stage-2': Star
  }

  const stageColors = {
    'stage-0': 'from-blue-500 to-cyan-500',
    'stage-1': 'from-orange-500 to-red-500',
    'stage-2': 'from-purple-500 to-pink-500'
  }

  const handleStageClick = (stageId: string) => {
    router.push(`/stage/${stageId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl p-6 mx-auto max-w-md mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">青楓館式</h1>
          <h2 className="text-xl font-semibold text-blue-100">英語開発</h2>
        </div>
      </header>

      {/* Quest Path */}
      <div className="max-w-md mx-auto px-6 pb-20">
        {stages.map((stage, index) => {
          const IconComponent = stageIcons[stage.id as keyof typeof stageIcons]
          const isLocked = false // 全てのステージを利用可能に変更
          
          return (
            <div key={stage.id} className="relative mb-8">
              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div className="absolute left-1/2 top-32 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-white/30 to-transparent z-0"></div>
              )}
              
              {/* Stage Card */}
              <Card 
                className={`relative p-6 bg-gradient-to-r ${stageColors[stage.id as keyof typeof stageColors]} border-2 border-white/20 shadow-xl backdrop-blur-sm ${
                  isLocked ? 'opacity-60' : 'hover:shadow-2xl transition-all duration-300'
                }`}
              >
                <div className="text-center text-white">
                  {/* Stage Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {isLocked ? (
                          <Lock className="w-8 h-8 text-white/70" />
                        ) : (
                          <IconComponent className="w-8 h-8 text-white" />
                        )}
                      </div>
                      {!isLocked && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-yellow-900">✓</span>
                        </div>
                      )}
        </div>
      </div>

                  {/* Stage Title */}
                  <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                  <p className="text-white/90 text-sm mb-4">{stage.description}</p>
                  
                  {/* Sub-stages Count */}
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-sm font-medium">
                        {stage.subStages.length}個のエリア
                      </span>
                    </div>
            </div>
                  
                  {/* Action Button */}
                  <Button
                    onClick={() => handleStageClick(stage.id)}
                    disabled={isLocked}
                    variant="secondary"
                    className={`w-full ${
                      isLocked 
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        ロック中
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        挑戦する
                      </>
                    )}
                  </Button>
            </div>
          </Card>
          
              {/* Arrow Connector */}
              {index < stages.length - 1 && (
                <div className="flex justify-center mt-4">
                  <ArrowDown className="w-6 h-6 text-white/50" />
            </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 mx-6 rounded-2xl mb-8">
        <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 ミッション</h3>
        <div className="space-y-2 text-white/90 text-sm">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>英語が必要なバイトにチャレンジする</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>英語で30秒間、切れ目なく自己紹介をすることができる</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>英語アプリで7日間連続学習（Duolingoなど）</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>外国人観光客に話しかけてみる</span>
          </div>
        </div>
      </div>
    </div>
  )
}
