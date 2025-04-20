import { useState, useCallback } from 'react';
import { getApiKey } from '../utils/storage';
import { formatErrorMessage, withTimeout, detectLanguage } from '../utils/helpers';
import ReactMarkdown from 'react-markdown';

/**
 * Google Gemini API連携用カスタムフック
 * コード翻訳やエラーメッセージ解析のためのAPI通信を管理
 */
const useGemini = () => {
  // 状態管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /**
   * APIエンドポイントURL
   * Gemini APIのエンドポイント
   */
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  
  /**
   * リクエストタイムアウト時間（ミリ秒）
   */
  const REQUEST_TIMEOUT = 15000; // 15秒

  /**
   * 再試行回数
   */
  const MAX_RETRIES = 2;

  /**
   * APIリクエストヘッダーを作成
   * @param {string} apiKey - Google GeminiのAPIキー
   * @returns {Object} - ヘッダーオブジェクト
   */
  const createHeaders = () => {
    return {
      'Content-Type': 'application/json'
    };
  };

  /**
   * S-C-A-F-Tフレームワークに基づいた汎用的なプロンプトを作成する関数
   * @param {string} text - 分析対象のテキスト
   * @param {string} type - テキストの種類 ('code', 'error', 'auto'など)
   * @param {Object} options - オプションパラメータ
   * @returns {string} - 作成されたプロンプト
   */
  const createUniversalScaftPrompt = (text, type = 'auto', options = {}) => {
    const { level = 'simple' } = options;
    
    // タイプに応じたヒントを準備
    const typeHints = {
      'code': '提供されたコードスニペットを分析し、コードの目的、構造、潜在的な問題点を特定してください。',
      'error': 'エラーメッセージを分析し、エラーの原因と解決策を特定してください。',
      'library': 'この技術/ライブラリの概要を説明し、典型的な使用例と注意点を示してください。',
      'auto': '提供されたテキストの種類を自動的に特定し、最適な形式で解析してください。'
    };
    
    // レベルに応じた詳細度の指示
    const levelInstructions = {
      'simple': '初心者向けに簡潔で分かりやすい言葉で説明し、専門用語は必要最小限に抑えてください。',
      'detailed': '詳細な技術的分析を提供し、関連する技術的概念や背景情報も含めてください。'
    };
    
    // プロンプトのベース
    const systemPrompt = `
# S-C-A-F-Tフレームワークによる技術的内容の解析

あなたは経験豊富な技術エキスパートとして、提供された技術的な内容を分析し、「S-C-A-F-T」フレームワークに従って構造化された解説を提供してください。

## 指示事項:
- 以下の内容を日本語で解説してください。
- 技術的な専門用語は必要に応じて英語のまま使用しても構いません。
- 各セクションを明確に区分けして、見やすい形式で回答を構成してください。
- ${typeHints[type] || typeHints['auto']}
- ${levelInstructions[level] || levelInstructions['simple']}

## S-C-A-F-Tフレームワーク:

1. **Summary（概要）**: 
   - 内容の全体的な概要を簡潔に説明
   - 最も重要なポイントを1-2文で要約

2. **Cause（原因）**: 
   - 状況が生まれた技術的・論理的な理由や背景を特定し、平易な言葉で説明してください
   - 入力がコードやエラーの場合は、何が引き金となったのか／どのような構造・仕様が関与しているかも簡潔に示してください

3. **Analysis（分析）**: 
   - 内容の詳細な分析
   - コードの場合：実行フロー、重要な関数/変数の役割、コード構造
   - エラーの場合：エラーの種類、影響範囲、潜在的な原因

4. **Fix/Feature（修正/機能）**: 
   - 問題がある場合は解決策を具体的に提案
   - コードの改善方法や最適化の提案
   - 代替アプローチの提示

5. **Terminology（用語補足）**: 
   - 入力文や解説の中に含まれる専門用語・略語・概念について、初学者でも理解できるよう一言で補足説明してください
   - 項目ごとに「用語：説明」としてください（例：「npm：Node.jsのライブラリ管理ツール」）

## 解析対象の内容:
テキスト種類: ${type}
解説レベル: ${level}

===内容開始===
${text}
===内容終了===
`;

    return systemPrompt;
  };

  /**
   * APIレスポンスをパースする
   * @param {Object} response - APIレスポンスオブジェクト
   * @returns {string} - パースした結果テキスト
   */
  const parseResponse = (response) => {
    try {
      if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error('APIからの応答が不正です');
      }
  
      const content = response.candidates[0].content;
      
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('APIからの応答にコンテンツがありません');
      }
  
      return content.parts[0].text || '結果を取得できませんでした';
    } catch (error) {
      console.error('APIレスポンスのパースエラー:', error);
      throw new Error('APIからの応答を処理できませんでした');
    }
  };

  /**
   * APIリクエストを実行する（再試行ロジック含む）
   * @param {string} url - APIエンドポイント
   * @param {Object} options - フェッチオプション
   * @param {number} retryCount - 現在の再試行回数
   * @returns {Promise<Object>} - APIレスポンス
   */
  const fetchWithRetry = async (url, options, retryCount = 0) => {
    try {
      // タイムアウト付きのフェッチ
      const response = await withTimeout(
        fetch(url, options),
        REQUEST_TIMEOUT,
        'APIリクエストがタイムアウトしました'
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `APIエラー (${response.status}): ${response.statusText}`
        );
      }
  
      return await response.json();
    } catch (error) {
      // 再試行条件の確認
      if (retryCount < MAX_RETRIES && 
          (error.message.includes('timeout') || 
           error.message.includes('network') ||
           error.message.includes('429') || // Too Many Requests
           error.message.includes('500') || // Server Error
           error.message.includes('503'))) { // Service Unavailable
  
        console.log(`リクエスト失敗、再試行中... (${retryCount + 1}/${MAX_RETRIES})`);
        // 指数バックオフで再試行（待機時間を徐々に増やす）
        const backoffTime = 1000 * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return fetchWithRetry(url, options, retryCount + 1);
      }
  
      throw error;
    }
  };

  /**
   * コードを翻訳する
   * @param {string} text - 翻訳対象のテキスト
   * @param {string} type - テキストの種類 ('code', 'error', 'auto'など)
   * @param {Object} options - オプションパラメータ
   * @returns {Promise<string>} - 翻訳結果
   */
  const translateCode = useCallback(async (text, type = 'code', options = {}) => {
    if (!text.trim()) {
      setError('テキストが空です');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error('APIキーが設定されていません');
      }

      // 汎用プロンプトを使用
      const prompt = createUniversalScaftPrompt(text, type, options);
      
      // APIリクエストの設定
      const requestUrl = `${API_URL}?key=${apiKey}`;
      const requestOptions = {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        })
      };

      console.log('Sending request to Gemini API...');
      
      // APIリクエスト実行
      const response = await fetchWithRetry(requestUrl, requestOptions);
      
      // レスポンスをパース
      const parsedResult = parseResponse(response);
      // 太字の処理
      const processedResult = processMarkdown(parsedResult);
      setResult(processedResult);
      return processedResult;
    } catch (error) {
      console.error('Gemini API Error:', error);
      const formattedError = formatErrorMessage(error);
      setError(formattedError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return {
    translateCode,
    loading,
    error,
    result,
    clearResult: () => setResult(null),
    clearError: () => setError(null)
  };
};

export default useGemini; 