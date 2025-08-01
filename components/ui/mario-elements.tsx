"use client"

import { motion } from 'framer-motion'
import { Star, Circle, Square } from 'lucide-react'

// コイン コンポーネント
export function MarioCoin({ className = "", animated = true }: { className?: string, animated?: boolean }) {
  return (
    <motion.div
      className={`relative w-8 h-8 ${className}`}
      animate={animated ? { rotateY: [0, 180, 360] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full border-2 border-yellow-600 shadow-lg">
        <div className="absolute inset-1 bg-yellow-300 rounded-full">
          <div className="absolute inset-1 border-2 border-yellow-600 rounded-full flex items-center justify-center">
            <div className="text-yellow-800 font-bold text-xs">¥</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// スーパースター コンポーネント
export function MarioStar({ className = "", animated = true }: { className?: string, animated?: boolean }) {
  return (
    <motion.div
      className={`relative w-8 h-8 ${className}`}
      animate={animated ? { rotate: 360 } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      <Star className="w-full h-full fill-yellow-400 text-yellow-500 drop-shadow-lg" />
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-full" />
    </motion.div>
  )
}

// レンガブロック コンポーネント
export function BrickBlock({ children, className = "", onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.div
      className={`bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-orange-700 rounded-sm shadow-lg cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="h-full w-full bg-gradient-to-b from-orange-300/50 to-transparent p-2">
        {children}
      </div>
      {/* レンガのテクスチャ */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-1/2 border-b-2 border-orange-800/30"></div>
        <div className="absolute top-0 left-1/3 w-px h-1/2 bg-orange-800/30"></div>
        <div className="absolute top-1/2 left-1/6 w-px h-1/2 bg-orange-800/30"></div>
        <div className="absolute top-1/2 right-1/3 w-px h-1/2 bg-orange-800/30"></div>
      </div>
    </motion.div>
  )
}

// 土管 コンポーネント
export function WarpPipe({ className = "", direction = "up" }: { className?: string, direction?: "up" | "down" | "left" | "right" }) {
  const pipeStyles = {
    up: "bg-gradient-to-r from-green-500 to-green-600",
    down: "bg-gradient-to-r from-green-600 to-green-500 rotate-180",
    left: "bg-gradient-to-b from-green-500 to-green-600 -rotate-90",
    right: "bg-gradient-to-b from-green-600 to-green-500 rotate-90"
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`w-16 h-20 ${pipeStyles[direction]} rounded-t-xl border-4 border-green-700 shadow-xl`}>
        {/* パイプの内側 */}
        <div className="absolute top-0 left-2 right-2 h-3 bg-black rounded-t-xl"></div>
        {/* パイプのハイライト */}
        <div className="absolute top-2 left-1 w-2 h-16 bg-green-400/50 rounded-l-lg"></div>
      </div>
    </div>
  )
}

// ファイヤーフラワー コンポーネント
export function FireFlower({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative w-8 h-8 ${className}`}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-500 rounded-full"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-red-600">
        <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 to-red-400 rounded-full">
          <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </motion.div>
  )
}

// キノコ コンポーネント
export function Mushroom({ type = "super", className = "" }: { type?: "super" | "1up", className?: string }) {
  const colors = {
    super: { cap: "from-red-500 to-red-600", spots: "bg-white" },
    "1up": { cap: "from-green-500 to-green-600", spots: "bg-white" }
  }

  return (
    <motion.div
      className={`relative w-8 h-8 ${className}`}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* キノコの軸 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-b-full border border-yellow-400"></div>
      {/* キノコの傘 */}
      <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-7 h-5 bg-gradient-to-b ${colors[type].cap} rounded-t-full border border-red-700`}>
        {/* 白い斑点 */}
        <div className={`absolute top-1 left-1 w-1.5 h-1.5 ${colors[type].spots} rounded-full`}></div>
        <div className={`absolute top-0.5 right-1 w-1 h-1 ${colors[type].spots} rounded-full`}></div>
        <div className={`absolute top-2 right-2 w-1.5 h-1.5 ${colors[type].spots} rounded-full`}></div>
      </div>
    </motion.div>
  )
}

// 雲 コンポーネント
export function MarioCloud({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end">
        <div className="w-4 h-4 bg-white rounded-full"></div>
        <div className="w-6 h-6 bg-white rounded-full -ml-1"></div>
        <div className="w-8 h-8 bg-white rounded-full -ml-2"></div>
        <div className="w-6 h-6 bg-white rounded-full -ml-2"></div>
        <div className="w-4 h-4 bg-white rounded-full -ml-1"></div>
      </div>
      <div className="w-full h-3 bg-white -mt-1 rounded-b-lg"></div>
    </div>
  )
}

// コインカウンター コンポーネント
export function CoinCounter({ count, className = "" }: { count: number, className?: string }) {
  return (
    <motion.div
      className={`flex items-center space-x-2 bg-black/80 text-yellow-400 px-3 py-1 rounded-full ${className}`}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring" }}
    >
      <MarioCoin animated={false} className="w-6 h-6" />
      <span className="font-bold text-lg">×{count}</span>
    </motion.div>
  )
}

// ライフカウンター コンポーネント
export function LifeCounter({ lives, className = "" }: { lives: number, className?: string }) {
  return (
    <motion.div
      className={`flex items-center space-x-2 bg-black/80 text-green-400 px-3 py-1 rounded-full ${className}`}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring" }}
    >
      <Mushroom type="1up" className="w-6 h-6" />
      <span className="font-bold text-lg">×{lives}</span>
    </motion.div>
  )
}

// XPバー コンポーネント
export function MarioXPBar({ current, max, className = "" }: { current: number, max: number, className?: string }) {
  const percentage = (current / max) * 100

  return (
    <div className={`relative bg-black/80 rounded-full p-1 ${className}`}>
      <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{current}/{max} XP</span>
        </div>
      </div>
    </div>
  )
} 