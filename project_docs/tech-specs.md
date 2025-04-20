# 技術仕様書

## 📱 技術スタック

### フロントエンド技術
- **React** - ユーザーインターフェイスを作るための道具箱
  - コンポーネントベースのアプローチでUIパーツを再利用できる
  - 仮想DOMを使って画面更新を速く行う
  - JSXという特殊な書き方でHTMLとJavaScriptを一緒に書ける

- **Tailwind CSS** - デザインを簡単に作れる魔法のクラス名
  - クラス名を追加するだけでデザインが適用される
  - カスタマイズしやすく、一貫性のあるデザインが作れる
  - レスポンシブデザイン（画面サイズに合わせたデザイン）が簡単

- **Framer Motion** - かっこいいアニメーションを追加するライブラリ
  - 簡単なコードで複雑なアニメーションが作れる
  - ユーザー体験を向上させる視覚効果を追加できる

### 開発ツール
- **Vite** - とても速い開発サーバーとビルドツール
  - 開発中の変更をすぐに画面に反映（ホットリロード）
  - ES Modulesを使って必要な部分だけを読み込む
  - ビルド時間が短く、効率的な開発が可能

- **ESLint** - コードの問題を見つけるチェッカー
  - コードの間違いや悪い書き方を教えてくれる
  - 一貫性のあるコードスタイルを保つ
  - 自動修正機能でコードをきれいに保つ

- **Prettier** - コードをきれいに整形するツール
  - インデント（字下げ）や改行を自動で調整
  - チーム全体で同じコードスタイルを維持
  - エディタと連携して保存時に自動整形

### バックエンド/API
- **Google Gemini API** - AIによるコード翻訳・説明機能
  - 複雑なコードを簡単な言葉で説明
  - エラーメッセージの意味を解説
  - プログラミング学習のサポート

- **Chrome Extension API** - ブラウザ拡張機能を作るためのAPI
  - ストレージ機能（設定や履歴の保存）
  - バックグラウンド処理（常駐機能）
  - コンテキストメニュー（右クリックメニュー）

## 🧩 アーキテクチャ設計

### 全体構造
```
ClearCodes拡張機能
├── ポップアップUI（ユーザーとの対話）
├── オプション画面（設定管理）
├── バックグラウンドスクリプト（常駐処理）
└── コンテンツスクリプト（ウェブページとの連携）
```

### データフロー
1. ユーザーがコードをポップアップUIに入力
2. フロントエンドがAPIリクエストを生成
3. Gemini APIがコード翻訳・解析を実行
4. レスポンスがフロントエンドに返され表示
5. 履歴データがローカルストレージに保存

### API連携実装
```
src/hooks/
├── useGemini.js    # Gemini API呼び出しを管理するカスタムフック
├── useStorage.js   # Chrome Storageを操作するカスタムフック
└── useHistory.js   # 翻訳履歴を管理するカスタムフック

src/utils/
├── storage.js      # ストレージ操作のユーティリティ関数
└── helpers.js      # 共通のヘルパー関数（フォーマット、検証など）
```

#### 主な機能
- **APIキー管理**: Chrome Storageに安全に保存
- **タイムアウト処理**: 長時間応答がない場合にエラーを表示
- **再試行ロジック**: ネットワークエラー時に自動再試行
- **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージ表示
- **言語検出**: 入力コードの言語を自動検出
- **プロンプト最適化**: 翻訳品質向上のためのカスタムプロンプト

### コンポーネント構成
- **App** - メインのアプリケーションコンテナ
  - 全体の状態管理とコンポーネントの配置

- **InputBox** - コード入力用のテキストエリア
  - ユーザー入力の受け付けと検証
  - プレースホルダーとフォーカス効果

- **ActionButton** - 翻訳実行などのアクション
  - ローディング状態の表示
  - ホバーとクリックのアニメーション効果

- **OutputBox** - 翻訳・説明結果の表示領域
  - 結果のフォーマット表示
  - コピー機能
  - シンタックスハイライト

- **SettingsPanel** - 設定オプションの管理
  - APIキー設定
  - テーマ切り替え
  - 翻訳モード設定

## 💾 データモデル

### 設定データ
```javascript
{
  apiKey: "string",         // Gemini APIキー
  theme: "light" | "dark",  // テーマ設定
  fontSize: "small" | "medium" | "large",  // フォントサイズ
  translationMode: "detailed" | "simple",  // 翻訳モード
  language: "ja" | "en" | "es" | ...,      // 表示言語
}
```

### 履歴エントリ
```javascript
{
  id: "string",             // 一意のID
  timestamp: Date,          // 作成日時
  sourceCode: "string",     // 元のコード
  translatedText: "string", // 翻訳結果
  language: "string",       // プログラミング言語
  isFavorite: boolean,      // お気に入り状態
}
```

### APIリクエスト
```javascript
{
  model: "gemini-pro",      // 使用モデル
  prompt: "string",         // コードと指示
  temperature: 0.4,         // 創造性の度合い（低いほど正確）
  maxOutputTokens: 800,     // 最大出力トークン数
}
```

## 🔧 コーディング規約

### 命名規則
- **ファイル名**: パスカルケース（例: `InputBox.jsx`）
- **コンポーネント**: パスカルケース（例: `ActionButton`）
- **関数**: キャメルケース（例: `handleSubmit`）
- **変数**: キャメルケース（例: `isLoading`）
- **定数**: 大文字スネークケース（例: `DEFAULT_TIMEOUT`）

### ディレクトリ構造
```
src/
├── assets/           # 画像やアイコンなどの静的ファイル
├── components/       # UIコンポーネント
├── hooks/            # カスタムReactフック
├── services/         # API通信などのサービス
├── utils/            # ユーティリティ関数
├── pages/            # 画面全体のコンポーネント
├── styles/           # グローバルスタイル
├── manifest.json     # 拡張機能の設定
├── index.jsx         # メインのエントリーポイント
└── options.jsx       # 設定画面のエントリーポイント
```

### コードスタイル
- インデント: 2スペース
- セミコロン: 必須
- 引用符: シングルクォート
- 行の最大長: 80文字
- コメント: 機能や難しい部分に必ず追加

### コンポーネント設計原則
- 単一責任の原則: 一つのコンポーネントは一つの機能に集中
- プロップドリルを避ける: 必要に応じてコンテキストを使用
- カスタムフックで複雑なロジックを分離
- 副作用は`useEffect`でまとめる

## 🔄 開発フロー

### 開発環境セットアップ
1. リポジトリのクローン: `git clone [リポジトリURL]`
2. 依存関係のインストール: `npm install`
3. 開発サーバー起動: `npm run dev`
4. Chrome拡張機能として読み込み:
   - Chrome拡張機能ページを開く (`chrome://extensions/`)
   - デベロッパーモードをオン
   - 「パッケージ化されていない拡張機能を読み込む」でdistフォルダを選択

### ビルドプロセス
1. ソースコードの検証: `npm run lint`
2. プロダクションビルド: `npm run build`
3. 拡張機能パッケージング: `npm run package`

### テスト戦略
- **単体テスト**: 個々のコンポーネントと関数のテスト
- **統合テスト**: 複数のコンポーネントの連携テスト
- **E2Eテスト**: 実際のブラウザでの動作確認
- **手動テスト**: エッジケースと実際のユーザー体験

## 🔐 セキュリティ対策

### APIキー管理
- Chrome Storageの`sync`ストレージで安全に保管
- クライアントサイドのみで使用し、外部には送信しない
- 設定画面でのみ表示、通常の操作では非表示

### データ保護
- すべてのデータはローカルでのみ保存
- センシティブデータは暗号化して保存
- 不要なデータは定期的に削除

### コード品質確保
- ESLintで潜在的なセキュリティ問題をチェック
- 依存ライブラリの脆弱性を定期的にスキャン
- コード変更時のレビューを徹底

## ⚡ パフォーマンス最適化

### レンダリング最適化
- React.memoによる不要な再レンダリングの防止
- ラベル化されたコンポーネントの最適化
- 大きなリストには仮想スクロールを使用

### バンドルサイズ削減
- コード分割でポップアップとオプション画面を分離
- ツリーシェイキングで未使用コードを削除
- 画像の最適化と適切なフォーマット選択

### 応答性の向上
- ローディング状態の視覚的フィードバック
- リクエストのタイムアウト処理
- バックグラウンドでのデータプリフェッチ

## 📏 品質管理

### コード品質
- Pull Requestレビュープロセス
- コードカバレッジ目標: 80%以上
- 自動テストのCIパイプライン統合

### ユーザー体験品質
- アクセシビリティチェック(WAI-ARIA準拠)
- 画面サイズ対応チェック
- キーボード操作のサポート

### エラー監視
- エラーログのローカル保存
- 重大なエラーの報告オプション
- エラー発生時の優雅な失敗処理

## 🌐 国際化対応

### 多言語サポート
- i18nライブラリを使用した翻訳管理
- 言語ファイルの分離と動的読み込み
- 右から左への言語(RTL)のサポート

### 文化的な配慮
- 日付と時刻の形式を地域に合わせて表示
- 色やアイコンの文化的意味を考慮
- 翻訳テキストの文脈を考慮した適応

## 📚 技術的な参考資料

### 公式ドキュメント
- [React公式ガイド](https://ja.reactjs.org/docs/getting-started.html)
- [Chrome拡張機能開発ドキュメント](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Vite公式ガイド](https://vitejs.dev/guide/)
- [Gemini API公式リファレンス](https://ai.google.dev/docs/)

### 学習リソース
- [Chrome拡張機能開発チュートリアル](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/)
- [React Hooksの使い方](https://ja.reactjs.org/docs/hooks-intro.html)
- [Framer Motionアニメーションガイド](https://www.framer.com/docs/)

### コーディング例
```jsx
// InputBox.jsx の例
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputBox = ({ onSubmit, placeholder }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };
  
  return (
    <motion.div
      className={`border rounded-md p-2 ${
        isFocused ? 'border-blue-500' : 'border-gray-300'
      }`}
      animate={{ borderColor: isFocused ? '#3b82f6' : '#d1d5db' }}
    >
      <textarea
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full outline-none resize-none"
        placeholder={placeholder || "コードを入力してください..."}
        rows={5}
      />
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        翻訳する
      </button>
    </motion.div>
  );
};

export default InputBox;
```
