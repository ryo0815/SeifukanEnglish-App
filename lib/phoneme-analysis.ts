// 音素レベルでの詳細評価システム

export interface PhonemeScore {
  phoneme: string
  score: number
  expected: string
  actual: string
  feedback: string
}

export interface DetailedPronunciationAnalysis {
  overallScore: number
  phonemeScores: PhonemeScore[]
  wordScores: WordScore[]
  fluencyScore: number
  intonationScore: number
  rhythmScore: number
  visualFeedback: VisualFeedback
  katakanaDetection: KatakanaDetection
  nativePronunciationScore: number
}

export interface WordScore {
  word: string
  score: number
  phonemes: PhonemeScore[]
  stress: number
  timing: number
}

export interface VisualFeedback {
  waveform: number[]
  phonemeTimeline: PhonemeTimeline[]
  stressPattern: number[]
  pitchContour: number[]
}

export interface PhonemeTimeline {
  phoneme: string
  startTime: number
  endTime: number
  score: number
  color: string
}

export interface KatakanaDetection {
  detected: boolean
  confidence: number
  patterns: string[]
  acousticFeatures: AcousticFeatures
}

export interface AcousticFeatures {
  formantPatterns: number[]
  pitchContour: number[]
  rhythmConsistency: number
  syllableBoundaries: number[]
  spectralCentroid: number
  spectralRolloff: number
  zeroCrossingRate: number
  energyDistribution: number[]
}

// 英語の主要音素パターン
export const ENGLISH_PHONEMES = {
  // 子音
  'p': { ipa: 'p', examples: ['pen', 'map'], difficulty: 1 },
  'b': { ipa: 'b', examples: ['bad', 'job'], difficulty: 1 },
  't': { ipa: 't', examples: ['tea', 'bet'], difficulty: 1 },
  'd': { ipa: 'd', examples: ['day', 'bed'], difficulty: 1 },
  'k': { ipa: 'k', examples: ['key', 'back'], difficulty: 1 },
  'g': { ipa: 'ɡ', examples: ['go', 'bag'], difficulty: 1 },
  'f': { ipa: 'f', examples: ['fan', 'leaf'], difficulty: 2 },
  'v': { ipa: 'v', examples: ['van', 'leave'], difficulty: 2 },
  'θ': { ipa: 'θ', examples: ['thin', 'bath'], difficulty: 3 },
  'ð': { ipa: 'ð', examples: ['this', 'bathe'], difficulty: 3 },
  's': { ipa: 's', examples: ['see', 'bus'], difficulty: 1 },
  'z': { ipa: 'z', examples: ['zoo', 'buzz'], difficulty: 2 },
  'ʃ': { ipa: 'ʃ', examples: ['ship', 'fish'], difficulty: 3 },
  'ʒ': { ipa: 'ʒ', examples: ['vision', 'measure'], difficulty: 3 },
  'h': { ipa: 'h', examples: ['hat', 'ahead'], difficulty: 1 },
  'm': { ipa: 'm', examples: ['man', 'ham'], difficulty: 1 },
  'n': { ipa: 'n', examples: ['no', 'sun'], difficulty: 1 },
  'ŋ': { ipa: 'ŋ', examples: ['sing', 'ring'], difficulty: 3 },
  'l': { ipa: 'l', examples: ['leg', 'ball'], difficulty: 2 },
  'r': { ipa: 'ɹ', examples: ['red', 'car'], difficulty: 3 },
  'w': { ipa: 'w', examples: ['wet', 'cow'], difficulty: 2 },
  'j': { ipa: 'j', examples: ['yes', 'boy'], difficulty: 2 },
  'tʃ': { ipa: 'tʃ', examples: ['chair', 'catch'], difficulty: 3 },
  'dʒ': { ipa: 'dʒ', examples: ['job', 'badge'], difficulty: 3 },

  // 母音
  'i': { ipa: 'i', examples: ['see', 'meet'], difficulty: 2 },
  'ɪ': { ipa: 'ɪ', examples: ['sit', 'bit'], difficulty: 2 },
  'e': { ipa: 'e', examples: ['bed', 'red'], difficulty: 2 },
  'ɛ': { ipa: 'ɛ', examples: ['bet', 'get'], difficulty: 2 },
  'æ': { ipa: 'æ', examples: ['cat', 'hat'], difficulty: 3 },
  'ʌ': { ipa: 'ʌ', examples: ['cup', 'luck'], difficulty: 3 },
  'ɑ': { ipa: 'ɑ', examples: ['father', 'car'], difficulty: 2 },
  'ɔ': { ipa: 'ɔ', examples: ['law', 'saw'], difficulty: 2 },
  'ʊ': { ipa: 'ʊ', examples: ['put', 'book'], difficulty: 2 },
  'u': { ipa: 'u', examples: ['too', 'food'], difficulty: 2 },
  'ɜ': { ipa: 'ɜ', examples: ['bird', 'her'], difficulty: 3 },
  'ə': { ipa: 'ə', examples: ['about', 'sofa'], difficulty: 3 },
  'eɪ': { ipa: 'eɪ', examples: ['face', 'day'], difficulty: 2 },
  'aɪ': { ipa: 'aɪ', examples: ['price', 'my'], difficulty: 2 },
  'ɔɪ': { ipa: 'ɔɪ', examples: ['boy', 'toy'], difficulty: 2 },
  'aʊ': { ipa: 'aʊ', examples: ['mouth', 'now'], difficulty: 2 },
  'oʊ': { ipa: 'oʊ', examples: ['goat', 'no'], difficulty: 2 },
  'ɪə': { ipa: 'ɪə', examples: ['near', 'here'], difficulty: 3 },
  'eə': { ipa: 'eə', examples: ['square', 'there'], difficulty: 3 },
  'ʊə': { ipa: 'ʊə', examples: ['poor', 'sure'], difficulty: 3 }
}

// 音素の難易度に基づく重み付け
export function getPhonemeWeight(phoneme: string): number {
  const phonemeData = ENGLISH_PHONEMES[phoneme as keyof typeof ENGLISH_PHONEMES]
  if (!phonemeData) return 1
  
  // 難易度に基づく重み付け（難しい音素ほど重要）
  switch (phonemeData.difficulty) {
    case 1: return 1.0    // 基本音素
    case 2: return 1.5    // 中級音素
    case 3: return 2.0    // 上級音素
    default: return 1.0
  }
}

// 音素レベルの詳細評価
export function analyzePhonemeLevel(
  recognizedText: string,
  referenceText: string,
  audioData?: Float32Array,
  azureScore?: number // Azure評価スコアを追加
): DetailedPronunciationAnalysis {
  const phonemeScores: PhonemeScore[] = []
  const wordScores: WordScore[] = []
  
  // 参照テキストを音素に分解
  const referencePhonemes = extractPhonemes(referenceText)
  const recognizedPhonemes = extractPhonemes(recognizedText)
  
  // 各音素を評価（より厳格に）
  referencePhonemes.forEach((phoneme, index) => {
    const recognizedPhoneme = recognizedPhonemes[index] || ''
    const score = evaluatePhoneme(phoneme, recognizedPhoneme, audioData)
    
    phonemeScores.push({
      phoneme,
      score,
      expected: phoneme,
      actual: recognizedPhoneme,
      feedback: generatePhonemeFeedback(phoneme, score)
    })
  })
  
  // 単語レベルでの評価
  const referenceWords = referenceText.toLowerCase().split(' ')
  const recognizedWords = recognizedText.toLowerCase().split(' ')
  
  referenceWords.forEach((word, index) => {
    const recognizedWord = recognizedWords[index] || ''
    const wordScore = evaluateWord(word, recognizedWord, phonemeScores)
    
    wordScores.push({
      word,
      score: wordScore.score,
      phonemes: wordScore.phonemes,
      stress: wordScore.stress,
      timing: wordScore.timing
    })
  })
  
  // Azureスコアを考慮した全体的なスコア計算
  let overallScore = calculateOverallScore(phonemeScores, wordScores)
  
  // Azureスコアがある場合は、音素分析とAzure評価を組み合わせる
  if (azureScore !== undefined) {
    // 音素分析とAzure評価の重み付け（Azure評価を重視）
    overallScore = (overallScore * 0.3 + azureScore * 0.7)
  }
  
  const fluencyScore = calculateFluencyScore(audioData)
  const intonationScore = calculateIntonationScore(audioData)
  const rhythmScore = calculateRhythmScore(audioData)
  
  // カタカナ発音検出
  let katakanaDetection: KatakanaDetection = {
    detected: false,
    confidence: 0,
    patterns: [],
    acousticFeatures: {
      formantPatterns: [],
      pitchContour: [],
      rhythmConsistency: 0,
      syllableBoundaries: [],
      spectralCentroid: 0,
      spectralRolloff: 0,
      zeroCrossingRate: 0,
      energyDistribution: []
    }
  }
  
  let nativePronunciationScore = 100
  
  if (audioData) {
    katakanaDetection = detectKatakanaPronunciation(audioData)
    
    // カタカナ発音が検出された場合、スコアを大幅に下げる
    if (katakanaDetection.detected) {
      overallScore = Math.max(0, overallScore - (katakanaDetection.confidence * 60))
      nativePronunciationScore = Math.max(0, 100 - (katakanaDetection.confidence * 80))
    }
  }
  
  // 視覚的フィードバック生成
  const visualFeedback = generateVisualFeedback(phonemeScores, audioData)
  
  return {
    overallScore,
    phonemeScores,
    wordScores,
    fluencyScore,
    intonationScore,
    rhythmScore,
    visualFeedback,
    katakanaDetection,
    nativePronunciationScore
  }
}

// 音素抽出（簡易版）
function extractPhonemes(text: string): string[] {
  // 実際の実装では、より高度な音素解析が必要
  const phonemes: string[] = []
  
  // 基本的な音素パターンマッチング
  const patterns = [
    /tʃ/g, /dʒ/g, /θ/g, /ð/g, /ʃ/g, /ʒ/g, /ŋ/g,
    /eɪ/g, /aɪ/g, /ɔɪ/g, /aʊ/g, /oʊ/g, /ɪə/g, /eə/g, /ʊə/g,
    /æ/g, /ʌ/g, /ɑ/g, /ɔ/g, /ʊ/g, /ɜ/g, /ə/g,
    /p/g, /b/g, /t/g, /d/g, /k/g, /ɡ/g, /f/g, /v/g,
    /s/g, /z/g, /h/g, /m/g, /n/g, /l/g, /r/g, /w/g, /j/g
  ]
  
  let remainingText = text.toLowerCase()
  
  patterns.forEach(pattern => {
    const matches = remainingText.match(pattern)
    if (matches) {
      matches.forEach(match => {
        phonemes.push(match)
        remainingText = remainingText.replace(match, '')
      })
    }
  })
  
  // 残りの文字を個別の音素として扱う
  remainingText.split('').forEach(char => {
    if (char.match(/[a-z]/)) {
      phonemes.push(char)
    }
  })
  
  return phonemes
}

// 音素評価（より厳格に）
function evaluatePhoneme(expected: string, actual: string, audioData?: Float32Array): number {
  if (expected === actual) return 100
  
  // 音素の類似度を計算
  const similarity = calculatePhonemeSimilarity(expected, actual)
  
  // より厳格な評価基準
  let score = similarity * 100
  
  // 音声データがある場合は、音響的特徴も考慮
  if (audioData) {
    const acousticScore = analyzeAcousticFeatures(expected, audioData)
    score = (similarity * 0.6 + acousticScore * 0.4) * 100
  }
  
  // 高度なカタカナ発音検出
  const katakanaPatterns = [
    /[ァ-ヶ]/, // カタカナ文字
    /sorii/i, // ソーリー
    /sori/i,  // ソリ
    /sore/i,  // ソレ
    /[ソーリー]/, // カタカナ文字
    /[ソリ]/, // カタカナ文字
    /[ソレ]/, // カタカナ文字
    /[ァ-ヶ]{2,}/, // 連続するカタカナ
    /[ァ-ヶ][ァ-ヶ]/, // カタカナの組み合わせ
    /[ァ-ヶ][ー][ァ-ヶ]/, // カタカナ+長音符+カタカナ
  ]
  
  const hasKatakanaPattern = katakanaPatterns.some(pattern => pattern.test(actual))
  
  if (hasKatakanaPattern) {
    score = 0 // カタカナ発音は確実に0点
  }
  
  // ネイティブ特徴のチェック
  const hasNativeFeatures = checkNativePhonemeFeatures(expected, actual)
  if (!hasNativeFeatures) {
    score = Math.max(0, score - 20) // ネイティブ特徴がない場合は減点
  }
  
  return Math.round(score)
}

// 音素類似度計算
function calculatePhonemeSimilarity(expected: string, actual: string): number {
  // 音素の特徴に基づく類似度計算
  const features = {
    'θ': ['f', 's', 't'], // θと混同しやすい音素
    'ð': ['d', 'v', 'z'], // ðと混同しやすい音素
    'ʃ': ['s', 'tʃ'],     // ʃと混同しやすい音素
    'ʒ': ['z', 'dʒ'],     // ʒと混同しやすい音素
    'ŋ': ['n', 'm'],      // ŋと混同しやすい音素
    'r': ['l', 'w'],      // rと混同しやすい音素
    'æ': ['ɛ', 'ɑ'],      // æと混同しやすい音素
    'ʌ': ['ɑ', 'ɔ'],      // ʌと混同しやすい音素
    'ɜ': ['ə', 'ɔ'],      // ɜと混同しやすい音素
  }
  
  if (expected === actual) return 1.0
  
  const expectedFeatures = features[expected as keyof typeof features]
  if (expectedFeatures && expectedFeatures.includes(actual)) {
    return 0.6 // 混同しやすい音素
  }
  
  return 0.0 // 全く異なる音素
}

// ネイティブ音素特徴のチェック
function checkNativePhonemeFeatures(expected: string, actual: string): boolean {
  // 英語のネイティブ音素パターンをチェック
  const nativePatterns = {
    'θ': /θ|th/, // θ音の正しい発音
    'ð': /ð|th/, // ð音の正しい発音
    'ʃ': /ʃ|sh/, // ʃ音の正しい発音
    'ʒ': /ʒ|zh/, // ʒ音の正しい発音
    'ŋ': /ŋ|ng/, // ŋ音の正しい発音
    'r': /ɹ|r/,  // r音の正しい発音
    'æ': /æ|a/,  // æ音の正しい発音
    'ʌ': /ʌ|u/,  // ʌ音の正しい発音
    'ɜ': /ɜ|er/, // ɜ音の正しい発音
  }
  
  const pattern = nativePatterns[expected as keyof typeof nativePatterns]
  if (pattern) {
    return pattern.test(actual)
  }
  
  // デフォルトでは類似度が高い場合をネイティブ特徴とする
  return calculatePhonemeSimilarity(expected, actual) >= 0.8
}

// 音響的特徴分析
function analyzeAcousticFeatures(expectedPhoneme: string, audioData: Float32Array): number {
  // 簡易的な音響分析（実際の実装ではより高度な分析が必要）
  const amplitude = calculateAmplitude(audioData)
  const frequency = calculateFrequency(audioData)
  
  // 音素ごとの期待される音響特徴
  const expectedFeatures = getExpectedAcousticFeatures(expectedPhoneme)
  
  let score = 0
  
  // 振幅の評価
  if (amplitude >= expectedFeatures.minAmplitude && amplitude <= expectedFeatures.maxAmplitude) {
    score += 0.5
  }
  
  // 周波数の評価
  if (frequency >= expectedFeatures.minFrequency && frequency <= expectedFeatures.maxFrequency) {
    score += 0.5
  }
  
  return score
}

// 振幅計算
function calculateAmplitude(audioData: Float32Array): number {
  let sum = 0
  for (let i = 0; i < audioData.length; i++) {
    sum += Math.abs(audioData[i])
  }
  return sum / audioData.length
}

// 周波数計算（簡易版）
function calculateFrequency(audioData: Float32Array): number {
  // 実際の実装ではFFTを使用
  return 1000 // 仮の値
}

// 期待される音響特徴
function getExpectedAcousticFeatures(phoneme: string) {
  const features = {
    'θ': { minAmplitude: 0.1, maxAmplitude: 0.3, minFrequency: 4000, maxFrequency: 8000 },
    'ð': { minAmplitude: 0.2, maxAmplitude: 0.4, minFrequency: 2000, maxFrequency: 6000 },
    'ʃ': { minAmplitude: 0.3, maxAmplitude: 0.5, minFrequency: 3000, maxFrequency: 7000 },
    'r': { minAmplitude: 0.4, maxAmplitude: 0.6, minFrequency: 1000, maxFrequency: 3000 },
    // 他の音素も同様に定義
  }
  
  return features[phoneme as keyof typeof features] || {
    minAmplitude: 0.1, maxAmplitude: 0.5, minFrequency: 1000, maxFrequency: 5000
  }
}

// 単語評価
function evaluateWord(expected: string, actual: string, phonemeScores: PhonemeScore[]): {
  score: number
  phonemes: PhonemeScore[]
  stress: number
  timing: number
} {
  const wordPhonemes = phonemeScores.filter(p => 
    expected.includes(p.phoneme) || actual.includes(p.phoneme)
  )
  
  const averageScore = wordPhonemes.length > 0 
    ? wordPhonemes.reduce((sum, p) => sum + p.score, 0) / wordPhonemes.length
    : 0
  
  return {
    score: averageScore,
    phonemes: wordPhonemes,
    stress: calculateStressScore(expected, actual),
    timing: calculateTimingScore(expected, actual)
  }
}

// ストレス（アクセント）スコア
function calculateStressScore(expected: string, actual: string): number {
  // 簡易的なストレス評価
  return expected === actual ? 100 : 50
}

// タイミングスコア
function calculateTimingScore(expected: string, actual: string): number {
  // 簡易的なタイミング評価
  return expected === actual ? 100 : 50
}

// 全体的なスコア計算
function calculateOverallScore(phonemeScores: PhonemeScore[], wordScores: WordScore[]): number {
  const phonemeAverage = phonemeScores.length > 0
    ? phonemeScores.reduce((sum, p) => sum + p.score, 0) / phonemeScores.length
    : 0
  
  const wordAverage = wordScores.length > 0
    ? wordScores.reduce((sum, w) => sum + w.score, 0) / wordScores.length
    : 0
  
  return (phonemeAverage * 0.6 + wordAverage * 0.4)
}

// 流暢性スコア
function calculateFluencyScore(audioData?: Float32Array): number {
  if (!audioData) return 75
  // 実際の実装では、音声の連続性や自然さを分析
  return 80
}

// イントネーションスコア
function calculateIntonationScore(audioData?: Float32Array): number {
  if (!audioData) return 75
  // 実際の実装では、ピッチの変化を分析
  return 80
}

// リズムスコア
function calculateRhythmScore(audioData?: Float32Array): number {
  if (!audioData) return 75
  // 実際の実装では、音節のタイミングを分析
  return 80
}

// 視覚的フィードバック生成
function generateVisualFeedback(phonemeScores: PhonemeScore[], audioData?: Float32Array): VisualFeedback {
  const waveform = audioData ? generateWaveform(audioData) : generateDummyWaveform()
  const phonemeTimeline = generatePhonemeTimeline(phonemeScores)
  const stressPattern = generateStressPattern(phonemeScores)
  const pitchContour = generatePitchContour(audioData)
  
  return {
    waveform,
    phonemeTimeline,
    stressPattern,
    pitchContour
  }
}

// 波形生成
function generateWaveform(audioData: Float32Array): number[] {
  const waveform: number[] = []
  const step = Math.floor(audioData.length / 100) // 100ポイントにサンプリング
  
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

// ダミー波形生成
function generateDummyWaveform(): number[] {
  return Array.from({ length: 100 }, () => Math.random() * 0.5 + 0.1)
}

// 音素タイムライン生成
function generatePhonemeTimeline(phonemeScores: PhonemeScore[]): PhonemeTimeline[] {
  return phonemeScores.map((phoneme, index) => ({
    phoneme: phoneme.phoneme,
    startTime: index * 0.1,
    endTime: (index + 1) * 0.1,
    score: phoneme.score,
    color: getPhonemeColor(phoneme.score)
  }))
}

// ストレスパターン生成
function generateStressPattern(phonemeScores: PhonemeScore[]): number[] {
  return phonemeScores.map(p => p.score / 100)
}

// ピッチ輪郭生成
function generatePitchContour(audioData?: Float32Array): number[] {
  if (!audioData) return Array.from({ length: 100 }, () => 0.5)
  // 実際の実装では、FFTを使用してピッチを抽出
  return Array.from({ length: 100 }, () => Math.random() * 0.3 + 0.4)
}

// 音素スコアに基づく色決定
function getPhonemeColor(score: number): string {
  if (score >= 90) return '#22c55e' // 緑
  if (score >= 70) return '#eab308' // 黄
  if (score >= 50) return '#f97316' // 橙
  return '#ef4444' // 赤
}

// 音素フィードバック生成
function generatePhonemeFeedback(phoneme: string, score: number): string {
  if (score >= 90) return `${phoneme}の発音は完璧です！`
  if (score >= 70) return `${phoneme}の発音は良好です`
  if (score >= 50) return `${phoneme}の発音を改善してください`
  return `${phoneme}の発音を練習してください`
} 

// 高度な音響分析によるカタカナ発音検出
function detectKatakanaPronunciation(audioData: Float32Array): KatakanaDetection {
  const acousticFeatures = analyzeAdvancedAcousticFeatures(audioData)
  const katakanaPatterns = detectKatakanaPatterns(acousticFeatures)
  
  return {
    detected: katakanaPatterns.detected,
    confidence: katakanaPatterns.confidence,
    patterns: katakanaPatterns.patterns,
    acousticFeatures
  }
}

// 高度な音響特徴分析
function analyzeAdvancedAcousticFeatures(audioData: Float32Array): AcousticFeatures {
  const formantPatterns = analyzeFormantPatterns(audioData)
  const pitchContour = analyzePitchContour(audioData)
  const rhythmConsistency = analyzeRhythmConsistency(audioData)
  const syllableBoundaries = detectSyllableBoundaries(audioData)
  const spectralCentroid = calculateSpectralCentroid(audioData)
  const spectralRolloff = calculateSpectralRolloff(audioData)
  const zeroCrossingRate = calculateZeroCrossingRate(audioData)
  const energyDistribution = calculateEnergyDistribution(audioData)
  
  return {
    formantPatterns,
    pitchContour,
    rhythmConsistency,
    syllableBoundaries,
    spectralCentroid,
    spectralRolloff,
    zeroCrossingRate,
    energyDistribution
  }
}

// フォルマント分析（母音の音響特徴）
function analyzeFormantPatterns(audioData: Float32Array): number[] {
  const frameSize = 1024
  const hopSize = 512
  const formants: number[] = []
  
  for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
    const frame = audioData.slice(i, i + frameSize)
    const fft = performFFT(frame)
    const formantFrequencies = extractFormantFrequencies(fft)
    formants.push(...formantFrequencies)
  }
  
  return formants
}

// FFT実行（簡易版）
function performFFT(frame: Float32Array): Float32Array {
  // 実際の実装では、Web Audio APIのAnalyserNodeを使用
  // ここでは簡易的な実装
  const fft = new Float32Array(frame.length)
  for (let i = 0; i < frame.length; i++) {
    fft[i] = Math.abs(frame[i])
  }
  return fft
}

// フォルマント周波数抽出
function extractFormantFrequencies(fft: Float32Array): number[] {
  const formants: number[] = []
  const sampleRate = 16000 // 仮定
  
  // 簡易的なフォルマント検出
  for (let i = 1; i < fft.length - 1; i++) {
    if (fft[i] > fft[i-1] && fft[i] > fft[i+1] && fft[i] > 0.1) {
      const frequency = (i * sampleRate) / fft.length
      if (frequency > 500 && frequency < 4000) {
        formants.push(frequency)
      }
    }
  }
  
  return formants.slice(0, 3) // 最初の3つのフォルマント
}

// ピッチ軌跡分析
function analyzePitchContour(audioData: Float32Array): number[] {
  const frameSize = 512
  const hopSize = 256
  const pitchValues: number[] = []
  
  for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
    const frame = audioData.slice(i, i + frameSize)
    const pitch = calculatePitch(frame)
    pitchValues.push(pitch)
  }
  
  return pitchValues
}

// ピッチ計算（自己相関法）
function calculatePitch(frame: Float32Array): number {
  const correlation = new Float32Array(frame.length)
  
  for (let lag = 0; lag < frame.length; lag++) {
    let sum = 0
    for (let i = 0; i < frame.length - lag; i++) {
      sum += frame[i] * frame[i + lag]
    }
    correlation[lag] = sum
  }
  
  // ピーク検出
  let maxLag = 0
  let maxCorrelation = 0
  
  for (let lag = 50; lag < correlation.length / 2; lag++) {
    if (correlation[lag] > maxCorrelation) {
      maxCorrelation = correlation[lag]
      maxLag = lag
    }
  }
  
  const sampleRate = 16000
  return maxLag > 0 ? sampleRate / maxLag : 0
}

// リズム一貫性分析
function analyzeRhythmConsistency(audioData: Float32Array): number {
  const energyEnvelope = calculateEnergyEnvelope(audioData)
  const peaks = detectPeaks(energyEnvelope)
  const intervals = calculateIntervals(peaks)
  
  // 間隔の一貫性を計算
  if (intervals.length < 2) return 0
  
  const meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length
  
  // 一貫性スコア（分散が小さいほど高い）
  return Math.max(0, 100 - (variance / meanInterval) * 100)
}

// エネルギー包絡線計算
function calculateEnergyEnvelope(audioData: Float32Array): number[] {
  const frameSize = 256
  const envelope: number[] = []
  
  for (let i = 0; i < audioData.length; i += frameSize) {
    const frame = audioData.slice(i, Math.min(i + frameSize, audioData.length))
    const energy = frame.reduce((sum, sample) => sum + sample * sample, 0) / frame.length
    envelope.push(energy)
  }
  
  return envelope
}

// ピーク検出
function detectPeaks(envelope: number[]): number[] {
  const peaks: number[] = []
  const threshold = Math.max(...envelope) * 0.3
  
  for (let i = 1; i < envelope.length - 1; i++) {
    if (envelope[i] > threshold && envelope[i] > envelope[i-1] && envelope[i] > envelope[i+1]) {
      peaks.push(i)
    }
  }
  
  return peaks
}

// 間隔計算
function calculateIntervals(peaks: number[]): number[] {
  const intervals: number[] = []
  
  for (let i = 1; i < peaks.length; i++) {
    intervals.push(peaks[i] - peaks[i-1])
  }
  
  return intervals
}

// 音節境界検出
function detectSyllableBoundaries(audioData: Float32Array): number[] {
  const energyEnvelope = calculateEnergyEnvelope(audioData)
  const peaks = detectPeaks(energyEnvelope)
  
  // 音節境界はエネルギーが低い部分
  const boundaries: number[] = []
  const threshold = Math.min(...energyEnvelope) + (Math.max(...energyEnvelope) - Math.min(...energyEnvelope)) * 0.3
  
  for (let i = 1; i < energyEnvelope.length; i++) {
    if (energyEnvelope[i] < threshold && energyEnvelope[i-1] >= threshold) {
      boundaries.push(i)
    }
  }
  
  return boundaries
}

// スペクトラル重心計算
function calculateSpectralCentroid(audioData: Float32Array): number {
  const fft = performFFT(audioData)
  let weightedSum = 0
  let sum = 0
  
  for (let i = 0; i < fft.length; i++) {
    weightedSum += i * fft[i]
    sum += fft[i]
  }
  
  return sum > 0 ? weightedSum / sum : 0
}

// スペクトラルロールオフ計算
function calculateSpectralRolloff(audioData: Float32Array): number {
  const fft = performFFT(audioData)
  const threshold = 0.85 // 85%のエネルギー
  
  let cumulativeEnergy = 0
  const totalEnergy = fft.reduce((sum, value) => sum + value, 0)
  
  for (let i = 0; i < fft.length; i++) {
    cumulativeEnergy += fft[i]
    if (cumulativeEnergy >= totalEnergy * threshold) {
      return i / fft.length
    }
  }
  
  return 1.0
}

// ゼロクロス率計算
function calculateZeroCrossingRate(audioData: Float32Array): number {
  let crossings = 0
  
  for (let i = 1; i < audioData.length; i++) {
    if ((audioData[i] >= 0 && audioData[i-1] < 0) || (audioData[i] < 0 && audioData[i-1] >= 0)) {
      crossings++
    }
  }
  
  return crossings / audioData.length
}

// エネルギー分布計算
function calculateEnergyDistribution(audioData: Float32Array): number[] {
  const frameSize = 1024
  const hopSize = 512
  const distribution: number[] = []
  
  for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
    const frame = audioData.slice(i, i + frameSize)
    const energy = frame.reduce((sum, sample) => sum + sample * sample, 0) / frame.length
    distribution.push(energy)
  }
  
  return distribution
}

// カタカナパターン検出
function detectKatakanaPatterns(acousticFeatures: AcousticFeatures): {
  detected: boolean
  confidence: number
  patterns: string[]
} {
  const patterns: string[] = []
  let confidence = 0
  let detected = false
  
  // 1. フォルマントパターンの分析
  const formantScore = analyzeFormantPatternsForKatakana(acousticFeatures.formantPatterns)
  if (formantScore > 0.7) {
    patterns.push('フォルマントパターンがカタカナ発音を示唆')
    confidence += formantScore * 0.3
    detected = true
  }
  
  // 2. ピッチ軌跡の分析
  const pitchScore = analyzePitchContourForKatakana(acousticFeatures.pitchContour)
  if (pitchScore > 0.7) {
    patterns.push('ピッチ軌跡がカタカナ発音を示唆')
    confidence += pitchScore * 0.25
    detected = true
  }
  
  // 3. リズム一貫性の分析
  const rhythmScore = analyzeRhythmForKatakana(acousticFeatures.rhythmConsistency)
  if (rhythmScore > 0.7) {
    patterns.push('リズムパターンがカタカナ発音を示唆')
    confidence += rhythmScore * 0.25
    detected = true
  }
  
  // 4. 音節境界の分析
  const syllableScore = analyzeSyllableBoundariesForKatakana(acousticFeatures.syllableBoundaries)
  if (syllableScore > 0.7) {
    patterns.push('音節境界がカタカナ発音を示唆')
    confidence += syllableScore * 0.2
    detected = true
  }
  
  return {
    detected,
    confidence: Math.min(1.0, confidence),
    patterns
  }
}

// フォルマントパターンによるカタカナ検出
function analyzeFormantPatternsForKatakana(formants: number[]): number {
  if (formants.length === 0) return 0
  
  // カタカナ発音の特徴：フォルマント間隔が狭い
  const formantIntervals: number[] = []
  for (let i = 1; i < formants.length; i++) {
    formantIntervals.push(formants[i] - formants[i-1])
  }
  
  const averageInterval = formantIntervals.reduce((sum, interval) => sum + interval, 0) / formantIntervals.length
  
  // カタカナ発音では、フォルマント間隔が狭い傾向がある
  if (averageInterval < 800) {
    return 0.8
  } else if (averageInterval < 1200) {
    return 0.5
  }
  
  return 0.2
}

// ピッチ軌跡によるカタカナ検出
function analyzePitchContourForKatakana(pitchContour: number[]): number {
  if (pitchContour.length === 0) return 0
  
  // カタカナ発音の特徴：ピッチ変化が少ない
  let pitchChanges = 0
  for (let i = 1; i < pitchContour.length; i++) {
    const change = Math.abs(pitchContour[i] - pitchContour[i-1])
    if (change > 10) {
      pitchChanges++
    }
  }
  
  const changeRatio = pitchChanges / pitchContour.length
  
  // カタカナ発音では、ピッチ変化が少ない
  if (changeRatio < 0.1) {
    return 0.9
  } else if (changeRatio < 0.2) {
    return 0.6
  }
  
  return 0.3
}

// リズムによるカタカナ検出
function analyzeRhythmForKatakana(rhythmConsistency: number): number {
  // カタカナ発音の特徴：リズムが機械的で一貫性が高い
  if (rhythmConsistency > 90) {
    return 0.8
  } else if (rhythmConsistency > 70) {
    return 0.5
  }
  
  return 0.2
}

// 音節境界によるカタカナ検出
function analyzeSyllableBoundariesForKatakana(syllableBoundaries: number[]): number {
  if (syllableBoundaries.length === 0) return 0
  
  // カタカナ発音の特徴：音節境界が規則的
  const intervals: number[] = []
  for (let i = 1; i < syllableBoundaries.length; i++) {
    intervals.push(syllableBoundaries[i] - syllableBoundaries[i-1])
  }
  
  if (intervals.length === 0) return 0
  
  const meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length
  
  // カタカナ発音では、音節間隔の分散が小さい
  const coefficientOfVariation = Math.sqrt(variance) / meanInterval
  
  if (coefficientOfVariation < 0.1) {
    return 0.9
  } else if (coefficientOfVariation < 0.2) {
    return 0.6
  }
  
  return 0.3
} 