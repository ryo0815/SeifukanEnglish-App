// Azure Speech Service Configuration
export const AZURE_SPEECH_CONFIG = {
  key: process.env.AZURE_SPEECH_KEY || '',
  region: process.env.AZURE_SPEECH_REGION || '',
  endpoint: process.env.AZURE_SPEECH_REGION ? 
    `https://${process.env.AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/` : ''
}

export interface PronunciationAssessmentConfig {
  referenceText: string
  gradingSystem: 'FivePoint' | 'HundredMark'
  granularity: 'Phoneme' | 'Word' | 'FullText'
  dimension: 'Basic' | 'Comprehensive'
  enableMiscue: boolean
}

export interface AzurePronunciationResult {
  NBest: Array<{
    Confidence: number
    Lexical: string
    ITN: string
    MaskedITN: string
    Display: string
    PronunciationAssessment: {
      AccuracyScore: number
      FluencyScore: number
      CompletenessScore: number
      PronunciationScore: number
    }
    Words: Array<{
      Word: string
      Offset: number
      Duration: number
      PronunciationAssessment: {
        AccuracyScore: number
        ErrorType: 'None' | 'Omission' | 'Insertion' | 'Mispronunciation'
      }
      Syllables?: Array<{
        Syllable: string
        PronunciationAssessment: {
          AccuracyScore: number
        }
        Phonemes?: Array<{
          Phoneme: string
          PronunciationAssessment: {
            AccuracyScore: number
          }
        }>
      }>
    }>
  }>
  RecognitionStatus: string
  Offset: number
  Duration: number
}

export function createPronunciationAssessmentConfig(
  referenceText: string,
  options: Partial<PronunciationAssessmentConfig> = {}
): PronunciationAssessmentConfig {
  return {
    referenceText,
    gradingSystem: options.gradingSystem || 'HundredMark',
    granularity: options.granularity || 'Phoneme',
    dimension: options.dimension || 'Comprehensive',
    enableMiscue: options.enableMiscue || false
  }
}

export function createAzureHeaders(config: PronunciationAssessmentConfig) {
  const headers = new Headers()
  headers.append('Ocp-Apim-Subscription-Key', AZURE_SPEECH_CONFIG.key)
  headers.append('Content-Type', 'audio/wav; codecs=audio/pcm; samplerate=16000')
  headers.append('Accept', 'application/json')
  
  const pronunciationAssessmentParams = {
    ReferenceText: config.referenceText,
    GradingSystem: config.gradingSystem,
    Granularity: config.granularity,
    Dimension: config.dimension,
    EnableMiscue: config.enableMiscue
  }
  
  headers.append('Pronunciation-Assessment', JSON.stringify(pronunciationAssessmentParams))
  
  return headers
}

export function createAzureUrl(language: string = 'en-US') {
  const url = new URL(AZURE_SPEECH_CONFIG.endpoint)
  url.searchParams.append('language', language)
  url.searchParams.append('format', 'detailed')
  return url
}

export function processAzureResult(result: AzurePronunciationResult, referenceText: string) {
  const nBest = result.NBest?.[0]
  const pronunciationAssessment = nBest?.PronunciationAssessment
  
  if (!pronunciationAssessment) {
    return {
      error: 'No pronunciation assessment data received',
      overallScore: 0,
      overallGrade: 'F' as const,
      gradeDescription: 'エラー - 音声を認識できませんでした',
      improvements: ['もう一度録音してください'],
      positives: [],
      feedback: '音声が正しく認識されませんでした。'
    }
  }

  const accuracyScore = pronunciationAssessment.AccuracyScore || 0
  const fluencyScore = pronunciationAssessment.FluencyScore || 0
  const completenessScore = pronunciationAssessment.CompletenessScore || 0
  const pronunciationScore = pronunciationAssessment.PronunciationScore || 0
  
  const overallScore = Math.round(pronunciationScore)
  const gradeResult = scoreToGrade(overallScore)
  
  const words = nBest?.Words || []
  const wordDetails = words.map(word => ({
    word: word.Word,
    accuracy: word.PronunciationAssessment?.AccuracyScore || 0,
    errorType: word.PronunciationAssessment?.ErrorType || 'None'
  }))
  
  const improvements = generateImprovements(accuracyScore, fluencyScore, completenessScore, wordDetails)
  const positives = generatePositives(accuracyScore, fluencyScore, completenessScore)
  const feedback = generateFeedback(overallScore, accuracyScore, fluencyScore, referenceText)
  
  return {
    overallScore,
    overallGrade: gradeResult.grade,
    gradeDescription: gradeResult.description,
    pronunciationScore,
    accuracyScore,
    fluencyScore,
    completenessScore,
    recognizedText: nBest?.Display || '',
    wordDetails,
    improvements,
    positives,
    feedback
  }
}

function scoreToGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F', description: string } {
  if (score >= 90) {
    return { grade: 'A', description: '優秀 - ネイティブレベルの発音' }
  } else if (score >= 75) {
    return { grade: 'B', description: '良好 - 自然で理解しやすい発音' }
  } else if (score >= 60) {
    return { grade: 'C', description: '普通 - 理解できる発音' }
  } else if (score >= 45) {
    return { grade: 'D', description: '要改善 - 練習が必要' }
  } else if (score >= 30) {
    return { grade: 'E', description: '不十分 - 大幅な改善が必要' }
  } else {
    return { grade: 'F', description: '不合格 - 音声認識困難' }
  }
}

function generateImprovements(accuracy: number, fluency: number, completeness: number, wordDetails: any[]): string[] {
  const improvements = []
  
  // 発音の正確性に関するアドバイス
  if (accuracy < 75) {
    improvements.push('母音と子音をもっとはっきりと発音しましょう')
  }
  
  // 流暢さに関するアドバイス
  if (fluency < 75) {
    improvements.push('もっと自然なリズムとイントネーションで話しましょう')
  }
  
  // 完全性に関するアドバイス
  if (completeness < 85) {
    improvements.push('文章の最後まで完全に発音するよう心がけましょう')
  }
  
  // 特定の単語に関するアドバイス
  const problemWords = wordDetails.filter(w => w.accuracy < 65)
  if (problemWords.length > 0) {
    const wordList = problemWords.slice(0, 2).map(w => `「${w.word}」`).join('と')
    improvements.push(`特に${wordList}の発音を重点的に練習してください`)
  }
  
  // 発音の種類別アドバイス
  if (accuracy < 70) {
    const tips = [
      '口の形を意識して、はっきりと発音しましょう',
      'お手本の音声をよく聞いて、真似して練習しましょう',
      'ゆっくりでも正確な発音を心がけましょう'
    ]
    improvements.push(tips[Math.floor(Math.random() * tips.length)])
  }
  
  // 最低限のアドバイスを確保
  if (improvements.length === 0) {
    improvements.push('良い発音です！継続して練習しましょう')
  }
  
  // 3つに制限
  return improvements.slice(0, 3)
}

function generatePositives(accuracy: number, fluency: number, completeness: number): string[] {
  const positives = []
  
  if (accuracy >= 85) {
    positives.push('発音の正確性が素晴らしいです！')
  } else if (accuracy >= 70) {
    positives.push('発音がとても良くなっています！')
  }
  
  if (fluency >= 85) {
    positives.push('自然な流暢さで話せています！')
  } else if (fluency >= 70) {
    positives.push('話すリズムが良いですね！')
  }
  
  if (completeness >= 95) {
    positives.push('最後まで完璧に発音できました！')
  } else if (completeness >= 85) {
    positives.push('文章をしっかりと話せています！')
  }
  
  // 全体的な励ましの言葉
  if (positives.length === 0) {
    if (accuracy >= 60 || fluency >= 60) {
      positives.push('頑張って発音練習していますね！')
    } else {
      positives.push('練習を続けることで必ず上達します！')
    }
  }
  
  return positives
}

function generateFeedback(overallScore: number, accuracy: number, fluency: number, referenceText: string): string {
  if (overallScore >= 90) {
    return `素晴らしい！「${referenceText}」を${overallScore}点の高得点で発音できました。ネイティブレベルの発音です。`
  } else if (overallScore >= 75) {
    return `とても良い発音です！「${referenceText}」を${overallScore}点で発音できました。合格です！`
  } else if (overallScore >= 60) {
    return `良い発音です！「${referenceText}」を${overallScore}点で発音できました。もう少し練習すると更に良くなります。`
  } else if (overallScore >= 45) {
    return `「${referenceText}」の発音を練習しましょう。${overallScore}点でした。お手本をよく聞いて再挑戦してください。`
  } else if (overallScore >= 30) {
    return `「${referenceText}」の発音にはもう少し練習が必要です。ゆっくりでも正確に発音することを心がけましょう。`
  } else {
    return `音声が認識できませんでした。もう一度、はっきりと「${referenceText}」を発音してみてください。`
  }
} 