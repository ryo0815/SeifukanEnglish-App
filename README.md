# SeifukanEnglish - AI発音評価英語学習アプリ

Azure Cognitive Services Speech API を使用した、中高生向けのインタラクティブな英語発音練習アプリです。

## 🎯 機能

- **AI発音評価**: Microsoft Azure Speech Service による高精度な発音分析
- **音素レベル分析**: 個別の音素・音節レベルでの詳細フィードバック
- **韻律評価**: イントネーション、リズム、流暢性の評価
- **ステージ制システム**: 段階的な学習進行
- **リアルタイム録音**: ブラウザ上での音声録音・再生
- **詳細フィードバック**: A-F グレード評価と改善ポイント

## 🛠 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Radix UI + shadcn/ui
- **AI サービス**: Azure Cognitive Services Speech API
- **音声処理**: Web Audio API, MediaRecorder API

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region
```

### 3. Azure Speech Service の設定

1. [Azure Portal](https://portal.azure.com) でSpeech Serviceリソースを作成
2. APIキーとリージョンを取得
3. 環境変数に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが開きます。

## 📦 デプロイ

⚠️ **重要**: このアプリはサーバーサイドAPIを使用するため、**静的サイトとしてはデプロイできません**。

### Vercelでのデプロイ（推奨）

1. **Vercelアカウントの準備**
   - [Vercel](https://vercel.com) にサインアップ
   - GitHubアカウントと連携

2. **プロジェクトのインポート**
   - Vercelダッシュボードで「New Project」をクリック
   - GitHubリポジトリ `ryo0815/Seifukan-English-App` を選択
   - フレームワークとして「Next.js」を選択

3. **環境変数の設定**
   - Vercelプロジェクトの「Settings」→「Environment Variables」で以下を設定：
   ```
   AZURE_SPEECH_KEY=your_actual_azure_speech_key
   AZURE_SPEECH_REGION=your_azure_region (例: japanwest)
   ```

4. **デプロイ**
   - 「Deploy」をクリック
   - 初回デプロイが完了するまで待機（約2-3分）

5. **動作確認**
   - デプロイされたURLでアプリケーションを確認
   - 発音評価機能が正常に動作することを確認

### その他のデプロイ方法

1. **Netlify Functions**
   - Netlify Functions として API ルートをデプロイ

2. **Azure Static Web Apps**
   - Azure Functions と統合してデプロイ

3. **Docker**
   ```bash
   docker build -t seifukan-english .
   docker run -p 3000:3000 seifukan-english
   ```

## 🎮 使い方

1. ホーム画面からステージを選択
2. サブステージで発音練習したいフレーズを選択
3. マイクボタンを押して録音開始
4. フレーズを発音
5. 停止ボタンを押して録音終了
6. AI による発音評価結果を確認

## 📊 評価システム

- **A (90-100)**: 優秀 - ネイティブレベル
- **B (80-89)**: 良好 - 非常に理解しやすい
- **C (70-79)**: 普通 - 理解しやすい
- **D (60-69)**: 要改善 - 理解可能だが改善の余地
- **E (0-59)**: 大幅改善必要 - 集中的な練習が必要

## 🔧 API エンドポイント

### POST /api/speech-evaluation

音声ファイルを受け取り、発音評価を返します。

**リクエスト**:
- `audio`: 音声ファイル (WAV形式)
- `referenceText`: 参照テキスト

**レスポンス**:
```json
{
  "overallGrade": "B",
  "gradeDescription": "良好 - 非常に理解しやすい発音",
  "pronunciationScore": 87,
  "accuracyScore": 87,
  "fluencyScore": 100,
  "completenessScore": 100,
  "recognizedText": "Sorry.",
  "improvements": [],
  "positives": ["認識できる発音でした"],
  "feedback": "Azure発音評価スコア: 87/100"
}
```

## 🎨 カスタマイズ

### 新しいステージの追加

`app/stage/[stageId]/[subStageId]/page.tsx` を参考に新しいステージを作成できます。

### UI テーマの変更

`tailwind.config.ts` でカラーパレットをカスタマイズできます。

## 🐛 トラブルシューティング

### 音声録音ができない
- ブラウザでマイクアクセス許可を確認
- HTTPS環境で実行（本番環境）

### Azure API エラー
- APIキーとリージョンが正しく設定されているか確認
- Azure Speech Service の利用制限を確認

### 400 Bad Request エラー
- 音声ファイル形式（WAV, 16kHz推奨）を確認
- 参照テキストが正しく設定されているか確認

## 📄 ライセンス

MIT License

## 🌐 Vercelデプロイ

### 1. Vercelアカウントでデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryo0815/SeifukanEnglish)

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `AZURE_SPEECH_KEY` | Azure Speech Service APIキー | `1234567890abcdef...` |
| `AZURE_SPEECH_REGION` | Azure Speech Serviceリージョン | `japaneast` |

### 3. デプロイ手順

1. **GitHubからインポート**:
   - Vercel ダッシュボードで「New Project」をクリック
   - このリポジトリを選択してインポート

2. **環境変数設定**:
   - Settings > Environment Variables で上記の変数を追加
   - Production, Preview, Development 全てにチェック

3. **デプロイ実行**:
   - 自動的にビルド・デプロイが開始されます
   - 数分でデプロイ完了

### 4. 設定ファイル

- `vercel.json`: Vercel固有の設定（APIタイムアウト等）
- `.env.example`: 環境変数テンプレート

### 5. トラブルシューティング

**ビルドエラーが発生した場合:**
- 環境変数が正しく設定されているか確認
- Azure Speech Service リソースが有効か確認

**API エラーが発生した場合:**
- APIキーの権限を確認
- 使用量制限に達していないか確認

## 🤝 コントリビューション

Issue や Pull Request を歓迎します！

## 📞 サポート

質問や問題がある場合は、GitHub Issues でお知らせください。

---

Made with ❤️ by Ryo
