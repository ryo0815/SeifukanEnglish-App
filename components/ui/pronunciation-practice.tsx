"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phrase } from "@/lib/phrases"
import { 
  createPronunciationAssessmentConfig, 
  createAzureHeaders, 
  createAzureUrl,
  processAzureResult,
  AZURE_SPEECH_CONFIG 
} from "@/lib/azure-speech"
import { 
  Mic, 
  MicOff, 
  Play, 
  RefreshCw,
  Volume2,
  Award
} from "lucide-react"

interface PronunciationPracticeProps {
  phrase: Phrase
  onComplete: () => void
}

interface EvaluationResult {
  overallScore: number
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  gradeDescription: string
  improvements: string[]
  feedback: string
  recognizedText?: string
}

export default function PronunciationPractice({ phrase, onComplete }: PronunciationPracticeProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // グレード色の定義
  const gradeColors = {
    'A': 'bg-green-500',
    'B': 'bg-blue-500', 
    'C': 'bg-yellow-500',
    'D': 'bg-orange-500',
    'E': 'bg-red-500',
    'F': 'bg-gray-500'
  }

  // 録音開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioData(audioBlob)
        
        // ストリームを停止
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError('マイクにアクセスできませんでした')
      console.error('Recording error:', err)
    }
  }

  // 録音停止
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // 音声再生
  const playAudio = () => {
    if (audioData) {
      const audioUrl = URL.createObjectURL(audioData)
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
        
        audioRef.current.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
      }
    }
  }

  // 発音評価
  const evaluatePronunciation = async () => {
    if (!audioData) return

    setIsEvaluating(true)
    setError(null)

    try {
      const config = createPronunciationAssessmentConfig(phrase.text)
      const headers = createAzureHeaders(config)
      const url = createAzureUrl()

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: audioData
      })

      if (!response.ok) {
        throw new Error(`Azure API Error: ${response.status}`)
      }

      const result = await response.json()
      const processedResult = processAzureResult(result, phrase.text)
      
      setEvaluation({
        overallScore: processedResult.overallScore,
        overallGrade: processedResult.overallGrade,
        gradeDescription: processedResult.gradeDescription,
        improvements: processedResult.improvements,
        feedback: processedResult.feedback,
        recognizedText: processedResult.recognizedText
      })

    } catch (err) {
      console.error('Evaluation error:', err)
      setError('評価中にエラーが発生しました')
    } finally {
      setIsEvaluating(false)
    }
  }

  // リセット
  const reset = () => {
    setAudioData(null)
    setEvaluation(null)
    setError(null)
    setIsRecording(false)
    setIsPlaying(false)
  }

  // 合格判定
  const isPassed = evaluation && ['A', 'B'].includes(evaluation.overallGrade)

  return (
    <div className="space-y-6">
      {/* フレーズ表示 */}
      <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{phrase.text}</h2>
            <p className="text-lg text-blue-200">{phrase.phonetic}</p>
            <p className="text-lg text-yellow-200">{phrase.katakana}</p>
          </div>
          
          <Badge variant="secondary" className="text-sm">
            {phrase.difficulty === 'easy' ? '簡単' : 
             phrase.difficulty === 'medium' ? '普通' : '難しい'}
          </Badge>
        </div>
      </Card>

      {/* 録音コントロール */}
      <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white text-center">発音練習</h3>
          
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                録音開始
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white"
                size="lg"
              >
                <MicOff className="w-5 h-5 mr-2" />
                録音停止
              </Button>
            )}

            {audioData && (
              <>
                <Button
                  onClick={playAudio}
                  variant="outline"
                  size="lg"
                  disabled={isPlaying}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <Play className="w-5 h-5 mr-2" />
                  再生
                </Button>

                <Button
                  onClick={evaluatePronunciation}
                  disabled={isEvaluating}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="lg"
                >
                  {isEvaluating ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Award className="w-5 h-5 mr-2" />
                  )}
                  {isEvaluating ? '評価中...' : '評価する'}
                </Button>
              </>
            )}
          </div>

          {isRecording && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-red-400">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>録音中...</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* エラー表示 */}
      {error && (
        <Card className="p-4 bg-red-500/20 border border-red-500/30">
          <p className="text-red-200 text-center">{error}</p>
        </Card>
      )}

      {/* 評価結果 */}
      {evaluation && (
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center">評価結果</h3>
            
            {/* グレード表示 */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold ${gradeColors[evaluation.overallGrade]}`}>
                {evaluation.overallGrade}
              </div>
              <p className="text-white mt-2">{evaluation.gradeDescription}</p>
              <p className="text-white/80 text-sm mt-1">スコア: {evaluation.overallScore}/100</p>
            </div>

            {/* 認識された文章 */}
            {evaluation.recognizedText && (
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/80 text-sm">認識された音声:</p>
                <p className="text-white font-medium">{evaluation.recognizedText}</p>
              </div>
            )}

            {/* フィードバック */}
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white">{evaluation.feedback}</p>
            </div>

            {/* 改善ポイント */}
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">💡 改善ポイント</h4>
              <ul className="space-y-1">
                {evaluation.improvements.map((improvement, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={reset}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                もう一度
              </Button>

              {isPassed && (
                <Button
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  次へ進む
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 音声再生用の隠しエレメント */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
} 