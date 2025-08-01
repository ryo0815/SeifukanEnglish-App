import fs from 'fs/promises';
import path from 'path';
import wav from 'node-wav';
import Meyda from 'meyda';
import DynamicTimeWarping from 'dynamic-time-warping';

const FFT_SIZE = 512;
const HOP_SIZE = 128;
const ENERGY_THRESHOLD = 0.02;

/**
 * 音声データの前処理（無音トリミングと音量正規化）
 */
function preprocessAudio(channelData: Float32Array): Float32Array {
    let startIndex = 0;
    while (startIndex < channelData.length && Math.abs(channelData[startIndex]) < ENERGY_THRESHOLD) {
        startIndex++;
    }
    let endIndex = channelData.length - 1;
    while (endIndex >= 0 && Math.abs(channelData[endIndex]) < ENERGY_THRESHOLD) {
        endIndex--;
    }
    if (startIndex >= endIndex) return new Float32Array(0);
    const trimmedData = channelData.slice(startIndex, endIndex + 1);

    let maxAmplitude = 0;
    for (let i = 0; i < trimmedData.length; i++) {
        maxAmplitude = Math.max(maxAmplitude, Math.abs(trimmedData[i]));
    }
    if (maxAmplitude === 0) return trimmedData;

    const normalizedData = new Float32Array(trimmedData.length);
    for (let i = 0; i < trimmedData.length; i++) {
        normalizedData[i] = trimmedData[i] / maxAmplitude;
    }
    return normalizedData;
}

/**
 * WAV音声バッファからMFCC特徴量を抽出する
 */
function getAudioFeatures(audioBuffer: Buffer): { features: number[][], sampleRate: number } | null {
  try {
    const result = wav.decode(audioBuffer);
    const preprocessedData = preprocessAudio(result.channelData[0]);
    if (preprocessedData.length === 0) return null;
    
    Meyda.bufferSize = FFT_SIZE;
    const mfccFrames: number[][] = [];
    for (let i = 0; i + FFT_SIZE <= preprocessedData.length; i += HOP_SIZE) {
      const frame = preprocessedData.slice(i, i + FFT_SIZE);
      const mfcc = Meyda.extract('mfcc', frame) as number[];
      if(mfcc) {
          // 最初の係数（エネルギー）を除外し、発音の質に関わる12係数を利用
          mfccFrames.push(mfcc.slice(1, 13)); 
      }
    }
    return mfccFrames.length > 0 ? { features: mfccFrames, sampleRate: result.sampleRate } : null;
  } catch (error) {
    console.error('Error extracting features:', error);
    return null;
  }
}

/**
 * DTW距離を計算し、類似度スコアに変換する
 */
function compareAudioFeatures(userFeatures: number[][], referenceFeatures: number[][]): number {
  if (userFeatures.length < 2 || referenceFeatures.length < 2) return 0;

  const distFunc = (a: number[], b: number[]) => {
    let sum = 0;
    for(let i=0; i < Math.min(a.length, b.length); i++) sum += Math.pow(a[i] - b[i], 2);
    return Math.sqrt(sum);
  };
  
  const dtw = new DynamicTimeWarping(referenceFeatures, userFeatures, distFunc);
  const dist = dtw.getDistance();
  const pathLength = dtw.getPath().length;
  if (pathLength === 0) return 0;
  
  const normalizedDist = dist / pathLength;

  // --- スコア計算式を安定的な指数関数に変更 ---
  const similarity = Math.exp(-0.005 * normalizedDist); // 係数を調整し、より緩やかにスコアが減少するように変更

  console.log('--- Audio Comparison Details ---');
  console.log(`Raw DTW Distance: ${dist.toFixed(4)}`);
  console.log(`Warping Path Length: ${pathLength}`);
  console.log(`Normalized Distance: ${normalizedDist.toFixed(4)}`);
  console.log(`Similarity Score (0-1): ${similarity.toFixed(4)}`);
  console.log('------------------------------');

  return similarity;
}

/**
 * ユーザー音声とお手本音声を比較し、0-100のスコアを返す
 */
export async function getAudioComparisonScore(userAudioBuffer: Buffer, referenceText: string): Promise<number> {
  try {
    const fileName = `${referenceText.toLowerCase().replace(/[^a-z0-9]/g, '')}.wav`;
    const filePath = path.join(process.cwd(), 'public', 'audio', 'reference', fileName);
    const referenceAudioBuffer = await fs.readFile(filePath);

    const userAudioData = getAudioFeatures(userAudioBuffer);
    const referenceAudioData = getAudioFeatures(referenceAudioBuffer);

    if (userAudioData && referenceAudioData) {
      console.log(`Sample Rates - User: ${userAudioData.sampleRate}, Reference: ${referenceAudioData.sampleRate}`);
      if (userAudioData.sampleRate !== referenceAudioData.sampleRate) {
          console.error("FATAL: Sample rate mismatch. Cannot compare audio.");
          return 0;
      }

      const userFrames = userAudioData.features.length;
      const refFrames = referenceAudioData.features.length;
      console.log(`Frame counts - User: ${userFrames}, Reference: ${refFrames}`);
      if (Math.abs(userFrames - refFrames) > Math.max(userFrames, refFrames) * 0.5) {
          console.warn("Warning: Significant difference in audio length after preprocessing.");
      }

      const similarity = compareAudioFeatures(userAudioData.features, referenceAudioData.features);
      return Math.round(similarity * 100);
    }
    return 0;
  } catch (error) {
    console.error(`Error comparing audio for "${referenceText}":`, error);
    return 0;
  }
} 