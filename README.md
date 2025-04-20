# ClearCodes

<p align="center">
  <img src="public/icons/icon128.png" alt="ClearCodes Logo" width="128" height="128">
</p>

<p align="center">
  <b>プログラミングコードとエラーメッセージを、中学生でもわかる言葉に翻訳するChrome拡張機能</b>
</p>

## 📖 概要

ClearCodesは、複雑なプログラミングコードやエラーメッセージを、誰でも理解できるやさしい日本語に翻訳するChrome拡張機能です。Google Gemini APIを活用し、プログラミング初心者が技術的な言葉の壁を乗り越えるのを手助けします。

## ✨ 主な機能

- **コード翻訳**: 複雑なコードを平易な日本語で説明
- **エラー解説**: エラーメッセージの原因と解決策をわかりやすく説明
- **S-C-A-F-T形式**: 体系的な解説フレームワークで理解を深める
  - Summary（概要）: 内容の要点をまとめて説明
  - Cause（原因）: 問題の技術的・論理的背景を解説
  - Analysis（分析）: コードやエラーの詳細分析
  - Fix/Feature（修正/機能）: 解決策や改善方法を提案
  - Terminology（用語補足）: 専門用語をわかりやすく解説

## 🛠️ インストール方法

### 開発版を使用する場合
1. このリポジトリをクローン: `git clone [リポジトリURL]`
2. 依存パッケージをインストール: `npm install`
3. 拡張機能をビルド: `npm run build`
4. Chrome拡張機能ページ(`chrome://extensions/`)を開く
5. デベロッパーモードをオンにする
6. 「パッケージ化されていない拡張機能を読み込む」をクリック
7. `dist`フォルダを選択

### APIキーの設定
1. [Google AI Studio](https://makersuite.google.com/)でGemini APIキーを取得
2. 拡張機能のオプション画面でAPIキーを設定

## 🚀 使い方

1. 理解したいコードやエラーメッセージを選択
2. Chrome右上のClearCodesアイコンをクリック
3. 「Run」ボタンを押す
4. AI翻訳結果が表示される

## 🧰 技術スタック

- **フロントエンド**: React, Tailwind CSS, Framer Motion
- **ビルドツール**: Vite
- **API**: Google Gemini API
- **拡張機能**: Chrome Extension API

## 📄 ライセンス

このプロジェクトはMITライセンスのもとで公開されています。

## 🤝 貢献方法

1. Forkしてください
2. 新しいfeatureブランチを作成: `git checkout -b my-new-feature`
3. 変更をコミット: `git commit -am 'Add some feature'`
4. ブランチをPush: `git push origin my-new-feature`
5. Pull Requestを作成

## ✏️ 作者

- NEET.K
