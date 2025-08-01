"use client"

import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Target, 
  Users, 
  Clock, 
  Trophy, 
  Lock, 
  CheckCircle, 
  Play,
  ChevronRight,
  ChevronLeft
} from "lucide-react"

interface SubStage {
  id: string
  title: string
  description: string
  phrases: any[]
}

interface ZigzagSubstagesProps {
  subStages: SubStage[]
  onSubStageClick: (subStageId: string) => void
  stageId: string
}

export function ZigzagSubstages({ subStages, onSubStageClick, stageId }: ZigzagSubstagesProps) {
  const subStageIcons = [Target, Users, Clock, Trophy]
  
  const getSubStageStatus = (index: number) => {
    if (index === 0) return 'available'
    if (index > 0) return 'locked'
    return 'completed'
  }

  const getSubStageIcon = (index: number) => {
    return subStageIcons[index % subStageIcons.length]
  }

  const getStageColor = (stageId: string) => {
    const colors = {
      'stage-0': 'from-blue-500 to-cyan-500',
      'stage-1': 'from-orange-500 to-red-500',
      'stage-2': 'from-purple-500 to-pink-500'
    }
    return colors[stageId as keyof typeof colors] || 'from-green-500 to-green-600'
  }

  return (
    <div className="relative px-6 pb-20">
      {/* Background Path */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          <path
            d="M 50 100 L 100 50 L 150 100 L 200 50 L 250 100 L 300 50 L 350 100"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8,8"
            className="opacity-20"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative space-y-12">
        {subStages.map((subStage, index) => {
          const status = getSubStageStatus(index)
          const SubStageIcon = getSubStageIcon(index)
          const isEven = index % 2 === 0
          const isLocked = status === 'locked'
          const isCompleted = status === 'completed'
          const isAvailable = status === 'available'

          return (
            <motion.div
              key={subStage.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2 + index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* SubStage Icon */}
              <div className={`flex-shrink-0 ${isEven ? 'mr-12' : 'ml-12'}`}>
                <motion.div
                  whileHover={isAvailable ? { scale: 1.1 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  className="relative"
                >
                  {/* Connection Line */}
                  <div className={`absolute top-1/2 w-12 h-1 bg-gradient-to-r ${
                    isEven ? 'right-full' : 'left-full'
                  } ${
                    isLocked ? 'bg-gray-300' : 'from-green-400 to-green-600'
                  }`}></div>
                  
                  {/* Main Icon Circle */}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-600 text-white' 
                      : isLocked 
                      ? 'bg-gray-300 border-gray-400 text-gray-500' 
                      : 'bg-white border-green-400 text-green-600 hover:border-green-500 hover:shadow-2xl'
                  } transition-all duration-300`}>
                    {isCompleted ? (
                      <CheckCircle className="w-12 h-12" />
                    ) : isLocked ? (
                      <Lock className="w-12 h-12" />
                    ) : (
                      <SubStageIcon className="w-12 h-12" />
                    )}
                  </div>

                  {/* Progress Ring for Available Stages */}
                  {isAvailable && (
                    <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-pulse"></div>
                  )}

                  {/* Stage Number Badge */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isLocked 
                      ? 'bg-gray-400 text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                </motion.div>
              </div>

              {/* Content Card */}
              <div className="flex-1">
                <Card className={`p-6 border-2 shadow-lg transition-all duration-300 ${
                  isLocked 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-green-200 hover:border-green-300 bg-white hover:shadow-xl'
                }`}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className={`text-xl font-bold ${
                          isLocked ? 'text-gray-500' : 'text-gray-800'
                        }`}>
                          {subStage.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          isLocked 
                            ? 'bg-gray-100 text-gray-500' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {subStage.phrases.length}個のフレーズ
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm ${
                      isLocked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {subStage.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isLocked ? 'bg-gray-300' : 'bg-green-500'
                        }`}
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      ></div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={() => onSubStageClick(subStage.id)}
                        disabled={isLocked}
                        variant={isLocked ? "ghost" : "default"}
                        size="sm"
                        className={`${
                          isLocked 
                            ? 'text-gray-400' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            開始
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mt-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            前のステージ
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            次のステージ
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
} 