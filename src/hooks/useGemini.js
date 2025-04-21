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

    const typeHints = {
      'code': 'コードの目的、構造、注意点などを明確に説明してください。',
      'error': 'エラーが発生した理由とその対処法を説明してください。',
      'library': '概要、使用方法、注意点などを簡潔に説明してください。',
      'auto': '内容に応じて最適な形式で解説してください。'
    };

    const levelInstructions = {
      'simple': '初心者にも理解できるよう、簡潔で平易な表現を用いてください。',
      'detailed': '必要に応じて概念や背景情報を含め、丁寧に説明してください。'
    };

    return `
あなたは優秀な技術解説者です。以下の入力について、「S-C-A-F-T」フレームワークに従い、静かで論理的な日本語で解説してください。

解説対象の種類: ${type}
説明レベル: ${level}

${typeHints[type] || typeHints['auto']}
${levelInstructions[level] || levelInstructions['simple']}

出力フォーマット:
1. 状況（Situation）  
   入力の背景や前提、何に関する内容かを簡潔に述べる。

2. 原因（Cause）  
   その内容が発生・構成されている技術的な理由を説明する。

3. 分析（Analysis）  
   中身の詳細や仕組み、構造、重要な要素などを整理して説明する。

4. 対策または特徴（Fix or Feature）  
   問題がある場合は解決策を。そうでなければ応用・注意点・実用例などを提示する。

5. 用語補足（Terminology）  
   専門用語や略語が含まれる場合、初心者向けに簡潔な一文で補足する（不要であれば省略可）。

制約:
- 入力内容の再掲は禁止
- 絵文字・装飾記号（#, *, ** など）は使用しない
- 出力は600文字以内を目安とする
- 口調はフラットに。事実と構造に基づいた説明を優先する
- 日本語で出力すること

===内容開始===
${text}
===内容終了===
`;
  };

  /**
   * 再生成用のプロンプトを作成する関数
   * @param {string} code - 元のコード
   * @param {string} previousResult - 前回の結果
   * @returns {string} プロンプト
   */
  const createRegeneratePrompt = (code, previousResult) => {
    return `
あなたは優秀な技術解説者です。以下のコードをより詳細に解説してください。前回の説明だけでは十分理解できなかったため、さらに明確な解説が必要です。

# 元のコード:
\`\`\`
${code}
\`\`\`

# 前回の説明:
${previousResult}

# 指示:
1. 前回の説明よりも詳細に、コードの目的、機能、重要な部分を解説してください
2. 専門用語がある場合は、それについても簡潔に説明を加えてください
3. コードの流れや処理の順序を明確にしてください
4. 可能であれば、コードの改善点や注意点も提案してください

出力フォーマット:
1. 状況（Situation）  
   入力の背景や前提、何に関する内容かを簡潔に述べる。

2. 原因（Cause）  
   その内容が発生・構成されている技術的な理由を説明する。

3. 分析（Analysis）  
   中身の詳細や仕組み、構造、重要な要素などを整理して説明する。

4. 対策または特徴（Fix or Feature）  
   問題がある場合は解決策を。そうでなければ応用・注意点・実用例などを提示する。

5. 用語補足（Terminology）  
   専門用語や略語が含まれる場合、初心者向けに簡潔な一文で補足する。

制約:
- 入力内容の再掲は禁止
- 絵文字・装飾記号（#, *, ** など）は使用しない
- 日本語で出力すること
    `;
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
   * コードを翻訳する関数
   * @param {string} code - 翻訳対象のコード
   * @param {boolean} isRegenerate - 再生成モードかどうか
   * @returns {Promise<string>} 翻訳されたコード
   */
  const translateCode = async (code, isRegenerate = false) => {
    if (!code) return;
    
    setLoading(true);
    setError(null);
    
    // 再生成の場合は既存の結果を保持する
    if (!isRegenerate) {
      setResult(null);
    }

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error('APIキーが設定されていません');
      }

      // プロンプトの生成
      const prompt = isRegenerate
        ? createRegeneratePrompt(code, result)
        : createUniversalScaftPrompt(code);
      
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
            temperature: isRegenerate ? 0.6 : 0.4, // 再生成の場合は少し温度を上げる
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        })
      };

      console.log(`Sending request to Gemini API... ${isRegenerate ? '(Regenerate mode)' : ''}`);
      
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
  };

  const processMarkdown = (text) => {
    // 太字変換を削除し、テキストをそのまま返す
    return text;
  };

  // コンポーネントからアクセスできる関数とステートをエクスポート
  return {
    translateCode,
    loading,
    error,
    result,
    setResult,
    clearResult: () => setResult(null),
    clearError: () => setError(null)
  };
};

export default useGemini; 