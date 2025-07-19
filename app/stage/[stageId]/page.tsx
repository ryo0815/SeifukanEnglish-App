"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getStageById } from "@/lib/phrases"
import { 
  ArrowLeft, 
  Shield, 
  Sword, 
  Star,
  Play,
  CheckCircle,
  Lock
} from "lucide-react"

export default function StagePage() {
  const router = useRouter()
  const params = useParams()
  const stageId = params.stageId as string
  
  const stage = getStageById(stageId)
  
  if (!stage) {
    return <div>ステージが見つかりません</div>
  }

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

  const IconComponent = stageIcons[stageId as keyof typeof stageIcons]

  const handleSubStageClick = (subStageId: string) => {
    router.push(`/stage/${stageId}/${subStageId}`)
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="p-6 flex items-center">
        <Button 
          onClick={handleBack}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
      </header>

      {/* Stage Header */}
      <div className="px-6 mb-8">
        <Card className={`p-6 bg-gradient-to-r ${stageColors[stageId as keyof typeof stageColors]} border-2 border-white/20 shadow-xl`}>
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{stage.title}</h1>
            <p className="text-white/90">{stage.description}</p>
          </div>
        </Card>
      </div>

      {/* Sub-stages List */}
      <div className="px-6 pb-20">
        <h2 className="text-xl font-bold text-white mb-6 text-center">エリア一覧</h2>
        
        <div className="space-y-4">
          {stage.subStages.map((subStage, index) => {
            const isLocked = index > 0 // 最初のサブステージ以外はロック
            const isCompleted = false // 後で進捗管理を実装
            
            return (
              <Card
                key={subStage.id}
                className={`p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                  isLocked ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-white/70" />
                        ) : (
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{subStage.title}</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-3 ml-11">{subStage.description}</p>
                    <div className="ml-11">
                      <span className="bg-white/20 rounded-full px-3 py-1 text-white text-xs">
                        {subStage.phrases.length}個のフレーズ
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleSubStageClick(subStage.id)}
                    disabled={isLocked}
                    variant="secondary"
                    size="sm"
                    className={`${
                      isLocked 
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
} 