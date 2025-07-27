"use client"

import React from 'react'
import { DetailedPronunciationAnalysis, PhonemeTimeline } from '@/lib/phoneme-analysis'

interface PronunciationVisualizerProps {
  analysis: DetailedPronunciationAnalysis
  audioData?: Float32Array
}

export function PronunciationVisualizer({ analysis, audioData }: PronunciationVisualizerProps) {
  return (
    <div className="space-y-6">
      {/* 波形表示 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">音波分析</h3>
        <WaveformDisplay waveform={analysis.visualFeedback.waveform} />
      </div>

      {/* 音素タイムライン */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">音素分析</h3>
        <PhonemeTimelineDisplay timeline={analysis.visualFeedback.phonemeTimeline} />
      </div>

      {/* ストレスパターン */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">アクセント分析</h3>
        <StressPatternDisplay pattern={analysis.visualFeedback.stressPattern} />
      </div>

      {/* ピッチ輪郭 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">イントネーション分析</h3>
        <PitchContourDisplay contour={analysis.visualFeedback.pitchContour} />
      </div>

      {/* 詳細スコア */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">詳細スコア</h3>
        <DetailedScoresDisplay analysis={analysis} />
      </div>
    </div>
  )
}

// 波形表示コンポーネント
function WaveformDisplay({ waveform }: { waveform: number[] }) {
  const maxAmplitude = Math.max(...waveform)
  
  return (
    <div className="relative h-32 bg-white rounded border">
      <svg className="w-full h-full" viewBox={`0 0 ${waveform.length} 100`}>
        <path
          d={waveform.map((amplitude, index) => {
            const x = index
            const y = 50 - (amplitude / maxAmplitude) * 40
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={waveform.map((amplitude, index) => {
            const x = index
            const y = 50 + (amplitude / maxAmplitude) * 40
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  )
}

// 音素タイムライン表示コンポーネント
function PhonemeTimelineDisplay({ timeline }: { timeline: PhonemeTimeline[] }) {
  const totalDuration = timeline.length > 0 ? timeline[timeline.length - 1].endTime : 1
  
  return (
    <div className="space-y-2">
      {timeline.map((phoneme, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="h-8 rounded flex items-center justify-center text-xs font-mono text-white min-w-[3rem]"
            style={{ 
              backgroundColor: phoneme.color,
              width: `${(phoneme.endTime - phoneme.startTime) / totalDuration * 100}%`
            }}
          >
            {phoneme.phoneme}
          </div>
          <span className="text-xs text-gray-600">
            {phoneme.score.toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ストレスパターン表示コンポーネント
function StressPatternDisplay({ pattern }: { pattern: number[] }) {
  return (
    <div className="flex items-end space-x-1 h-20">
      {pattern.map((stress, index) => (
        <div
          key={index}
          className="bg-blue-500 rounded-t"
          style={{
            height: `${stress * 100}%`,
            width: `${100 / pattern.length}%`
          }}
        />
      ))}
    </div>
  )
}

// ピッチ輪郭表示コンポーネント
function PitchContourDisplay({ contour }: { contour: number[] }) {
  return (
    <div className="relative h-32 bg-white rounded border">
      <svg className="w-full h-full" viewBox={`0 0 ${contour.length} 100`}>
        <path
          d={contour.map((pitch, index) => {
            const x = index
            const y = 100 - pitch * 100
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  )
}

// 詳細スコア表示コンポーネント
function DetailedScoresDisplay({ analysis }: { analysis: DetailedPronunciationAnalysis }) {
  return (
    <div className="space-y-4">
      {/* スコア説明 */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">スコア説明</h4>
        <p className="text-xs text-blue-700">
          全体スコアは音素分析(30%)とAzure評価(70%)を組み合わせて計算されます。
          より正確な評価のため、Azure評価を重視しています。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">全体スコア</span>
            <span className="text-sm font-semibold">{analysis.overallScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysis.overallScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">流暢性</span>
            <span className="text-sm font-semibold">{analysis.fluencyScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysis.fluencyScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">イントネーション</span>
            <span className="text-sm font-semibold">{analysis.intonationScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysis.intonationScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">リズム</span>
            <span className="text-sm font-semibold">{analysis.rhythmScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysis.rhythmScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 音素スコア詳細表示コンポーネント
export function PhonemeScoresDisplay({ phonemeScores }: { phonemeScores: any[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-md font-semibold">音素別スコア</h4>
      <div className="grid grid-cols-2 gap-3">
        {phonemeScores.map((phoneme, index) => (
          <div key={index} className="bg-white rounded-lg p-3 border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-mono">{phoneme.phoneme}</span>
              <span className={`text-sm font-semibold ${
                phoneme.score >= 90 ? 'text-green-600' :
                phoneme.score >= 70 ? 'text-yellow-600' :
                phoneme.score >= 50 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {phoneme.score.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  phoneme.score >= 90 ? 'bg-green-500' :
                  phoneme.score >= 70 ? 'bg-yellow-500' :
                  phoneme.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${phoneme.score}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{phoneme.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// リアルタイム音波表示コンポーネント
export function RealTimeWaveform({ audioData }: { audioData?: Float32Array }) {
  const [waveform, setWaveform] = React.useState<number[]>([])

  React.useEffect(() => {
    if (audioData) {
      const newWaveform = generateWaveform(audioData)
      setWaveform(newWaveform)
    }
  }, [audioData])

  if (!audioData) {
    return (
      <div className="h-32 bg-gray-100 rounded border flex items-center justify-center">
        <span className="text-gray-500">音声データがありません</span>
      </div>
    )
  }

  return <WaveformDisplay waveform={waveform} />
}

// 波形生成関数（簡易版）
function generateWaveform(audioData: Float32Array): number[] {
  const waveform: number[] = []
  const step = Math.floor(audioData.length / 100)
  
  for (let i = 0; i < 100; i++) {
    const start = i * step
    const end = Math.min(start + step, audioData.length)
    let sum = 0
    
    for (let j = start; j < end; j++) {
      sum += Math.abs(audioData[j])
    }
    
    waveform.push(sum / (end - start))
  }
  
  return waveform
} 