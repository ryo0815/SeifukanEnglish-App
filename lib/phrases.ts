// フレーズデータ型定義
export interface Phrase {
  id: string
  text: string
  phonetic: string
  katakana: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface SubStage {
  id: string
  title: string
  description: string
  phrases: Phrase[]
}

export interface Stage {
  id: string
  title: string
  description: string
  icon: string
  subStages: SubStage[]
}

// ステージ0: 防御（受け身・反応の基本フレーズ）
const stage0: Stage = {
  id: 'stage-0',
  title: 'ステージ0：防御',
  description: '受け身のフレーズ',
  icon: '🛡️',
  subStages: [
    {
      id: 'stage-0-1',
      title: '聞き返しと確認',
      description: '相手の話を確認するためのフレーズ',
      phrases: [
        {
          id: 'sorry',
          text: 'Sorry?',
          phonetic: '/ˈsɔːri/',
          katakana: 'ソーリー？',
          difficulty: 'easy'
        },
        {
          id: 'excuse-me',
          text: 'Excuse me?',
          phonetic: '/ɪkˈskjuːz mi/',
          katakana: 'イクスキューズミー？',
          difficulty: 'easy'
        },
        {
          id: 'one-more-time',
          text: 'One more time, please.',
          phonetic: '/wʌn mɔːr taɪm pliːz/',
          katakana: 'ワンモアタイム、プリーズ',
          difficulty: 'medium'
        },
        {
          id: 'could-you-say-again',
          text: 'Could you say that again?',
          phonetic: '/kʊd ju seɪ ðæt əˈɡeɪn/',
          katakana: 'クッジューセイザットアゲイン？',
          difficulty: 'hard'
        },
        {
          id: 'what-did-you-say',
          text: 'What did you say?',
          phonetic: '/wʌt dɪd ju seɪ/',
          katakana: 'ワットディッジューセイ？',
          difficulty: 'medium'
        }
      ]
    },
    {
      id: 'stage-0-2',
      title: '自己紹介（短文）',
      description: '短い自己紹介フレーズ',
      phrases: [
        {
          id: 'high-school-student',
          text: "I'm a high school student.",
          phonetic: "/aɪm ə haɪ skuːl ˈstuːdənt/",
          katakana: 'アイムアハイスクールスチューデント',
          difficulty: 'medium'
        },
        {
          id: 'from-japan',
          text: "I'm from Japan.",
          phonetic: "/aɪm frʌm dʒəˈpæn/",
          katakana: 'アイムフロムジャパン',
          difficulty: 'easy'
        },
        {
          id: 'live-in-hyogo',
          text: 'I live in Hyogo.',
          phonetic: "/aɪ lɪv ɪn ˈhjoʊɡoʊ/",
          katakana: 'アイリブインヒョウゴ',
          difficulty: 'medium'
        },
        {
          id: '17-years-old',
          text: "I'm 17 years old.",
          phonetic: "/aɪm ˈsevənˌtiːn jɪrz oʊld/",
          katakana: 'アイムセブンティーンイヤーズオールド',
          difficulty: 'medium'
        },
        {
          id: 'go-to-seifukan',
          text: 'I go to Seifukan High School.',
          phonetic: "/aɪ ɡoʊ tu ˈseɪfuːkæn haɪ skuːl/",
          katakana: 'アイゴートゥーセイフカンハイスクール',
          difficulty: 'hard'
        }
      ]
    }
  ]
}

// ステージ1: 攻撃（道案内・誘導・発話の一歩目）
const stage1: Stage = {
  id: 'stage-1',
  title: 'ステージ1：攻撃',
  description: '道案内・誘導・発話の一歩目',
  icon: '⚔️',
  subStages: [
    {
      id: 'stage-1-1',
      title: '方向の伝え方',
      description: '道を案内するための基本フレーズ',
      phrases: [
        {
          id: 'go-straight',
          text: 'Go straight.',
          phonetic: '/ɡoʊ streɪt/',
          katakana: 'ゴーストレイト',
          difficulty: 'easy'
        },
        {
          id: 'turn-left',
          text: 'Turn left.',
          phonetic: '/tɜːrn left/',
          katakana: 'ターンレフト',
          difficulty: 'easy'
        },
        {
          id: 'turn-right',
          text: 'Turn right.',
          phonetic: '/tɜːrn raɪt/',
          katakana: 'ターンライト',
          difficulty: 'easy'
        },
        {
          id: 'go-back',
          text: 'Go back.',
          phonetic: '/ɡoʊ bæk/',
          katakana: 'ゴーバック',
          difficulty: 'easy'
        },
        {
          id: 'keep-going',
          text: 'Keep going.',
          phonetic: '/kiːp ˈɡoʊɪŋ/',
          katakana: 'キープゴーイング',
          difficulty: 'medium'
        }
      ]
    }
  ]
}

// ステージ2: 発信（自己表現・チャレンジ・応用）
const stage2: Stage = {
  id: 'stage-2',
  title: 'ステージ2：発信',
  description: '自己表現・チャレンジ・応用',
  icon: '⭐️',
  subStages: [
    {
      id: 'stage-2-1',
      title: '30秒自己紹介をつくる',
      description: '長めの自己紹介を練習',
      phrases: [
        {
          id: 'my-name-is',
          text: 'My name is [Name].',
          phonetic: '/maɪ neɪm ɪz/',
          katakana: 'マイネイムイズ[ネーム]',
          difficulty: 'easy'
        },
        {
          id: 'im-17-years-old',
          text: "I'm 17 years old.",
          phonetic: "/aɪm ˈsevənˌtiːn jɪrz oʊld/",
          katakana: 'アイムセブンティーンイヤーズオールド',
          difficulty: 'medium'
        },
        {
          id: 'go-to-seifukan-hs',
          text: 'I go to Seifukan High School.',
          phonetic: "/aɪ ɡoʊ tu ˈseɪfuːkæn haɪ skuːl/",
          katakana: 'アイゴートゥーセイフカンハイスクール',
          difficulty: 'hard'
        }
      ]
    }
  ]
}

export const stages: Stage[] = [stage0, stage1, stage2]

// ヘルパー関数
export function getStageById(stageId: string): Stage | undefined {
  return stages.find(stage => stage.id === stageId)
}

export function getSubStageById(stageId: string, subStageId: string): SubStage | undefined {
  const stage = getStageById(stageId)
  return stage?.subStages.find(subStage => subStage.id === subStageId)
}

export function getPhraseById(stageId: string, subStageId: string, phraseId: string): Phrase | undefined {
  const subStage = getSubStageById(stageId, subStageId)
  return subStage?.phrases.find(phrase => phrase.id === phraseId)
} 