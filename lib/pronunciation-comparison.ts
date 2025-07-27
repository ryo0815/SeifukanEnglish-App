// お手本音声との比較評価システム
export interface PronunciationComparisonResult {
  overallScore: number
  accuracyScore: number
  fluencyScore: number
  intonationScore: number
  rhythmScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'E'
  feedback: string[]
  detailedAnalysis: {
    phonemeAccuracy: number
    wordAccuracy: number
    prosodySimilarity: number
    timingAccuracy: number
    stressAccuracy: number
  }
}

export interface ReferenceAudio {
  id: string
  text: string
  audioUrl: string
  phonemeTranscription: string
  stressPattern: string
  timingPattern: number[]
}

// お手本音声データベース
export const referenceAudios: ReferenceAudio[] = [
  {
    id: 'sorry',
    text: 'Sorry?',
    audioUrl: '/audio/reference/sorry.mp3',
    phonemeTranscription: 'ˈsɔːri',
    stressPattern: 'SOR-ry',
    timingPattern: [0.3, 0.7] // 音節のタイミング
  },
  {
    id: 'hello',
    text: 'Hello',
    audioUrl: '/audio/reference/hello.mp3',
    phonemeTranscription: 'həˈloʊ',
    stressPattern: 'hel-LO',
    timingPattern: [0.4, 0.6]
  },
  {
    id: 'thank_you',
    text: 'Thank you',
    audioUrl: '/audio/reference/thank_you.mp3',
    phonemeTranscription: 'θæŋk juː',
    stressPattern: 'THANK you',
    timingPattern: [0.5, 0.5]
  }
]

// 音素レベルの比較
export function comparePhonemes(userPhonemes: string[], referencePhonemes: string[]): number {
  if (referencePhonemes.length === 0) return 0
  
  let correctPhonemes = 0
  const minLength = Math.min(userPhonemes.length, referencePhonemes.length)
  
  for (let i = 0; i < minLength; i++) {
    if (userPhonemes[i] === referencePhonemes[i]) {
      correctPhonemes++
    }
  }
  
  return (correctPhonemes / referencePhonemes.length) * 100
}

// ストレスパターンの比較
export function compareStressPatterns(userStress: string[], referenceStress: string[]): number {
  if (referenceStress.length === 0) return 0
  
  let correctStresses = 0
  const minLength = Math.min(userStress.length, referenceStress.length)
  
  for (let i = 0; i < minLength; i++) {
    if (userStress[i] === referenceStress[i]) {
      correctStresses++
    }
  }
  
  return (correctStresses / referenceStress.length) * 100
}

// タイミングの比較
export function compareTiming(userTiming: number[], referenceTiming: number[]): number {
  if (referenceTiming.length === 0) return 0
  
  let timingError = 0
  const minLength = Math.min(userTiming.length, referenceTiming.length)
  
  for (let i = 0; i < minLength; i++) {
    const error = Math.abs(userTiming[i] - referenceTiming[i])
    timingError += error
  }
  
  const averageError = timingError / minLength
  const maxError = 0.5 // 最大許容誤差
  
  return Math.max(0, (1 - averageError / maxError)) * 100
}

// プロソディ（イントネーション）の比較
export function compareProsody(userProsody: any, referenceProsody: any): number {
  // 簡易的なプロソディ比較
  const userPitch = userProsody?.pitch || 0
  const referencePitch = referenceProsody?.pitch || 0
  const pitchError = Math.abs(userPitch - referencePitch)
  
  const userDuration = userProsody?.duration || 0
  const referenceDuration = referenceProsody?.duration || 0
  const durationError = Math.abs(userDuration - referenceDuration)
  
  const pitchScore = Math.max(0, (1 - pitchError / 50)) * 100
  const durationScore = Math.max(0, (1 - durationError / 1000)) * 100
  
  return (pitchScore + durationScore) / 2
}

// 総合的な発音評価（改良版）
export function evaluatePronunciation(
  userAudio: ArrayBuffer,
  referenceText: string,
  userRecognizedText: string,
  userProsody: any
): PronunciationComparisonResult {
  
  // 1. テキスト認識の正確性
  const textAccuracy = calculateTextAccuracy(userRecognizedText, referenceText)
  
  // 2. 音素レベルの比較（改良版）
  const phonemeAccuracy = calculatePhonemeAccuracy(userRecognizedText, referenceText)
  
  // 3. プロソディ比較（改良版）
  const prosodyScore = compareProsody(userProsody, { pitch: 0, duration: 0 })
  
  // 4. ストレスパターン比較（改良版）
  const stressScore = calculateStressAccuracy(userRecognizedText, referenceText)
  
  // 5. タイミング比較（改良版）
  const timingScore = calculateTimingAccuracy(userAudio)
  
  // 6. カタカナ発音検出（追加）
  const katakanaDetection = detectKatakanaPronunciation(userRecognizedText, referenceText, userProsody)
  
  // 7. 総合スコア計算（カタカナペナルティ適用）
  let overallScore = calculateOverallScore({
    textAccuracy,
    phonemeAccuracy,
    prosodyScore,
    stressScore,
    timingScore
  })
  
  // カタカナ発音が検出された場合、大幅なペナルティを適用
  if (katakanaDetection.detected && katakanaDetection.confidence > 0.2) {
    const basePenalty = 60 // ペナルティを強化
    const penalty = katakanaDetection.confidence * basePenalty
    overallScore = Math.max(0, overallScore - penalty)
    console.log('=== KATAKANA DETECTED IN COMPARISON ===')
    console.log('Confidence:', katakanaDetection.confidence)
    console.log('Patterns:', katakanaDetection.patterns)
    console.log('Penalty applied:', penalty)
    console.log('Score before penalty:', overallScore + penalty)
    console.log('Score after penalty:', overallScore)
    
    // カタカナ発音が検出された場合、確実にC以下にする（より厳格に）
    if (katakanaDetection.confidence >= 0.5 && overallScore > 60) { // 信頼度閾値を下げる
      overallScore = 50; // 強制的にC判定以下
      console.log('=== FORCED C GRADE FOR KATAKANA ===')
    } else if (overallScore > 70) { // B判定以上ならCに調整
      overallScore = 60; // C判定に調整
      console.log('=== ADJUSTED C GRADE FOR KATAKANA ===')
    }
  }
  
  // 8. グレード判定
  const grade = getGradeFromScore(overallScore)
  
  // 9. フィードバック生成
  const feedback = generateFeedback({
    textAccuracy,
    phonemeAccuracy,
    prosodyScore,
    stressScore,
    timingScore,
    grade,
    katakanaDetection
  })
  
  return {
    overallScore,
    accuracyScore: textAccuracy,
    fluencyScore: phonemeAccuracy,
    intonationScore: prosodyScore,
    rhythmScore: timingScore,
    grade,
    feedback,
    detailedAnalysis: {
      phonemeAccuracy,
      wordAccuracy: textAccuracy,
      prosodySimilarity: prosodyScore,
      timingAccuracy: timingScore,
      stressAccuracy: stressScore
    }
  }
}

// テキスト認識の正確性
function calculateTextAccuracy(recognized: string, reference: string): number {
  const cleanRecognized = recognized.toLowerCase().replace(/[.,!?;:]/g, '').trim()
  const cleanReference = reference.toLowerCase().replace(/[.,!?;:]/g, '').trim()
  
  if (cleanRecognized === cleanReference) return 100
  
  const similarity = calculateSimilarity(cleanRecognized, cleanReference)
  return similarity * 100
}

// 音素レベルの正確性（簡易版）
function calculatePhonemeAccuracy(recognized: string, reference: string): number {
  const recognizedPhonemes = extractBasicPhonemes(recognized)
  const referencePhonemes = extractBasicPhonemes(reference)
  
  return comparePhonemes(recognizedPhonemes, referencePhonemes)
}

// ストレスパターンの正確性（簡易版）
function calculateStressAccuracy(recognized: string, reference: string): number {
  // 簡易的なストレスパターン検出
  const hasStress = /[A-Z]/.test(reference)
  const hasStressInRecognized = /[A-Z]/.test(recognized)
  
  if (hasStress === hasStressInRecognized) return 100
  return 70 // 部分的に正しい
}

// タイミングの正確性（改良版）
function calculateTimingAccuracy(audioBuffer: ArrayBuffer): number {
  // 音声の長さからタイミングを推定
  const duration = audioBuffer.byteLength / 16000 // 16kHzサンプリング
  const expectedDuration = 1.0 // 期待される長さ（秒）
  
  // より現実的なタイミング評価
  const timingError = Math.abs(duration - expectedDuration)
  const maxError = 0.8 // より寛容な許容誤差
  
  // 音声の長さが適切な範囲内かチェック
  if (duration < 0.3 || duration > 3.0) {
    return 30 // 非常に短いまたは長い音声は低評価
  }
  
  return Math.max(0, (1 - timingError / maxError)) * 100
}

// 総合スコア計算
function calculateOverallScore(scores: {
  textAccuracy: number
  phonemeAccuracy: number
  prosodyScore: number
  stressScore: number
  timingScore: number
}): number {
  const weights = {
    textAccuracy: 0.3,
    phonemeAccuracy: 0.3,
    prosodyScore: 0.2,
    stressScore: 0.1,
    timingScore: 0.1
  }
  
  return (
    scores.textAccuracy * weights.textAccuracy +
    scores.phonemeAccuracy * weights.phonemeAccuracy +
    scores.prosodyScore * weights.prosodyScore +
    scores.stressScore * weights.stressScore +
    scores.timingScore * weights.timingScore
  )
}

// 超厳格なグレード判定
function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (score >= 95) return 'A'
  if (score >= 85) return 'B'
  if (score >= 50) return 'C' // Cの閾値を下げる
  if (score >= 30) return 'D'
  return 'E'
}

// フィードバック生成（改良版）
function generateFeedback(scores: {
  textAccuracy: number
  phonemeAccuracy: number
  prosodyScore: number
  stressScore: number
  timingScore: number
  grade: string
  katakanaDetection?: {
    detected: boolean
    confidence: number
    patterns: string[]
  }
}): string[] {
  const feedback: string[] = []
  
  // カタカナ発音検出時の特別なフィードバック
  if (scores.katakanaDetection?.detected) {
    feedback.push('カタカナ発音を避けて、ネイティブ発音を練習してください')
    feedback.push('英語の音素を正確に発音するよう心がけてください')
    feedback.push('リズムとイントネーションを自然にしてください')
  }
  
  if (scores.textAccuracy < 90) {
    feedback.push('お手本の単語を正確に発音してください')
  }
  
  if (scores.phonemeAccuracy < 80) {
    feedback.push('一つ一つの音を正確に発音してください')
  }
  
  if (scores.prosodyScore < 75) {
    feedback.push('自然なイントネーションを心がけてください')
  }
  
  if (scores.stressScore < 80) {
    feedback.push('アクセントの位置に注意してください')
  }
  
  if (scores.timingScore < 70) {
    feedback.push('リズムとタイミングを自然にしてください')
  }
  
  if (scores.grade === 'A') {
    feedback.push('素晴らしい発音です！')
  } else if (scores.grade === 'B') {
    feedback.push('良い発音です。さらに練習しましょう')
  }
  
  return feedback
}

// 類似度計算
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

// レーベンシュタイン距離
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

// 基本的な音素抽出
function extractBasicPhonemes(text: string): string[] {
  const lowerText = text.toLowerCase()
  const phonemes: string[] = []
  
  // 簡易的な音素抽出
  for (let i = 0; i < lowerText.length; i++) {
    const char = lowerText[i]
    if (/[aeiou]/.test(char)) {
      phonemes.push('V') // 母音
    } else if (/[bcdfghjklmnpqrstvwxyz]/.test(char)) {
      phonemes.push('C') // 子音
    }
  }
  
  return phonemes
}

// 超厳格なカタカナ発音検出
function detectKatakanaPronunciation(recognizedText: string, referenceText: string, userProsody?: any): {
  detected: boolean
  confidence: number
  patterns: string[]
} {
  const patterns: string[] = []
  let confidence = 0
  let detected = false
  
  const cleanRecognized = recognizedText.toLowerCase().replace(/[.,!?;:]/g, '').trim()
  const cleanReference = referenceText.toLowerCase().replace(/[.,!?;:]/g, '').trim()
  
  // 1. 超厳格なカタカナ発音パターンの検出
  const katakanaTextPatterns = [
    /sorii/i, /sori/i, /[ァ-ヶ]/, /[ソーリー]/, /[ソリ]/, /[ソレ]/,
    /haroo/i, /[ハロー]/, /[ハロ]/,
    /sankyuu/i, /[サンキュー]/, /[サンク]/,
    /[あいうえお]/i, /[かきくけこ]/i, /[さしすせそ]/i, /[たちつてと]/i,
    /[なにぬねの]/i, /[はひふへほ]/i, /[まみむめも]/i, /[やゆよ]/i,
    /[らりるれろ]/i, /[わをん]/i,
    // 日本語的な発音パターンを追加
    /watto/i, /diddo/i, /yuu/i, /sei/i, /wot/i, /did/i, /yu/i, /say/i,
    /wat/i, /did/i, /you/i, /say/i, /wot/i, /diddo/i, /yu/i, /sei/i
  ]
  
  // より厳密なカタカナ検出
  let katakanaDetected = false
  for (const pattern of katakanaTextPatterns) {
    if (pattern.test(cleanRecognized)) {
      patterns.push('カタカナ発音パターン検出')
      confidence += 0.8
      katakanaDetected = true
      break
    }
  }
  
  // 2. Azureのプロソディデータを活用したカタカナ検出
  if (userProsody) {
    try {
      const prosodyData = typeof userProsody === 'string' ? JSON.parse(userProsody) : userProsody
      
      // モノトーンなイントネーション検出
      if (prosodyData.Words && prosodyData.Words[0]?.Feedback?.Prosody?.Intonation?.ErrorTypes?.includes('Monotone')) {
        patterns.push('モノトーンなイントネーション検出（Azure）')
        confidence += 0.5
        katakanaDetected = true
      }
      
      // 低いSNR検出
      if (prosodyData.SNR && prosodyData.SNR < 30) {
        patterns.push('低いSNR検出（Azure）')
        confidence += 0.4
        katakanaDetected = true
      }
      
      // 信頼度が低い場合
      if (prosodyData.Confidence && prosodyData.Confidence < 0.8) {
        patterns.push('低い信頼度検出（Azure）')
        confidence += 0.3
        katakanaDetected = true
      }
    } catch (error) {
      console.log('userProsody parsing error:', error)
    }
  }
  
  // 3. 音声の長さチェック（カタカナ発音は短い傾向）
  const audioLength = cleanRecognized.length
  const expectedLength = cleanReference.length
  if (audioLength < expectedLength * 0.8) {
    patterns.push('音声が短すぎる（カタカナ発音の可能性）')
    confidence += 0.4
    katakanaDetected = true
  }
  
  // 4. 音素パターンの詳細分析
  const recognizedPhonemes = extractBasicPhonemes(cleanRecognized)
  const referencePhonemes = extractBasicPhonemes(cleanReference)
  
  if (recognizedPhonemes.length < referencePhonemes.length * 0.8) {
    patterns.push('音素が不足している')
    confidence += 0.5
    katakanaDetected = true
  }
  
  // 5. 日本語特有の音素パターン検出
  const japanesePatterns = [
    /[あいうえお]/i, /[かきくけこ]/i, /[さしすせそ]/i,
    /[たちつてと]/i, /[なにぬねの]/i, /[はひふへほ]/i,
    /[まみむめも]/i, /[やゆよ]/i, /[らりるれろ]/i,
    /[わをん]/i
  ]
  
  for (const pattern of japanesePatterns) {
    if (pattern.test(cleanRecognized)) {
      patterns.push('日本語音素パターン検出')
      confidence += 0.9
      katakanaDetected = true
      break
    }
  }
  
  // 6. 音節構造の分析（カタカナは音節が単純）
  const syllableCount = (cleanRecognized.match(/[aeiou]/g) || []).length
  const expectedSyllables = (cleanReference.match(/[aeiou]/g) || []).length
  
  if (syllableCount < expectedSyllables * 0.8) {
    patterns.push('音節構造が単純すぎる')
    confidence += 0.4
    katakanaDetected = true
  }
  
  // 7. テキスト認識の不一致チェック（厳格化）
  if (cleanRecognized !== cleanReference) {
    patterns.push('認識テキストの不一致')
    confidence += 0.4
    detected = true
  }
  
  // 8. 英語の音素特徴の不足チェック（厳格化）
  const hasEnglishPhonemes = /[θðʃʒŋ]/.test(cleanRecognized) || 
                            /[æʌəɜː]/.test(cleanRecognized) ||
                            cleanRecognized.includes('th') || 
                            cleanRecognized.includes('sh') ||
                            cleanRecognized.includes('ch') ||
                            cleanRecognized.includes('sorry') ||
                            cleanRecognized.includes('hello') ||
                            cleanRecognized.includes('thank') ||
                            cleanRecognized.includes('what') ||
                            cleanRecognized.includes('did') ||
                            cleanRecognized.includes('you') ||
                            cleanRecognized.includes('say')
  
  if (!hasEnglishPhonemes && (cleanReference.includes('what') || cleanReference.includes('did') || cleanReference.includes('you') || cleanReference.includes('say'))) {
    patterns.push('英語音素の不足')
    confidence += 0.5
    detected = true
  }
  
  // 英語の正しい発音パターンが含まれている場合は、カタカナ検出を大幅に弱める
  const englishPatterns = [/sorry/i, /hello/i, /thank/i, /you/i, /how/i, /are/i, /what/i, /did/i, /say/i]
  let hasEnglishPattern = false
  for (const pattern of englishPatterns) {
    if (pattern.test(cleanRecognized)) {
      hasEnglishPattern = true
      break
    }
  }
  
  // 英語パターンがある場合は、カタカナ検出の信頼度を大幅に下げる
  if (hasEnglishPattern && katakanaDetected) {
    confidence = Math.max(0.2, confidence - 0.5) // 信頼度を大幅に下げる
    patterns.push('英語パターンも検出されたため、カタカナ検出の信頼度を大幅調整')
  }
  
  // 英語パターンがある場合は、他の検出も弱める
  if (hasEnglishPattern) {
    confidence = Math.max(0.2, confidence - 0.3) // 全体的に信頼度を下げる
    patterns.push('英語パターンが検出されたため、全体的な信頼度を調整')
  }
  
  if (katakanaDetected) {
    detected = true
  }
  
  return { detected, confidence: Math.min(1.0, confidence), patterns }
} 