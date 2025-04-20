/**
 * Utility Functions
 * アプリケーション全体で使用される共通の関数
 */

/**
 * テキストが空か確認
 * @param {string} text - 確認するテキスト
 * @returns {boolean} - 空の場合はtrue
 */
export const isEmpty = (text) => {
  return !text || text.trim() === '';
};

/**
 * 文字列の長さを確認する（文字数制限のチェック用）
 * @param {string} text - チェックする文字列
 * @param {number} maxLength - 最大文字数
 * @returns {boolean} - 制限内ならtrue
 */
export const isWithinCharLimit = (text, maxLength) => {
  return !text || text.length <= maxLength;
};

/**
 * エラーメッセージをユーザーフレンドリーな形式に変換
 * @param {Error} error - エラーオブジェクト
 * @returns {string} - ユーザーフレンドリーなエラーメッセージ
 */
export const formatErrorMessage = (error) => {
  if (!error) return '不明なエラーが発生しました。';
  
  // ネットワークエラーの処理
  if (error.message.includes('network') || error.message.includes('Network')) {
    return 'ネットワーク接続に問題があります。インターネット接続を確認してください。';
  }
  
  // APIエラーの処理
  if (error.message.includes('API key') || error.message.includes('apiKey')) {
    return 'APIキーが無効または期限切れです。設定で正しいAPIキーを入力してください。';
  }
  
  // レート制限エラー
  if (error.message.includes('rate limit') || error.message.includes('quota')) {
    return 'APIの利用制限に達しました。しばらく時間をおいてから再試行してください。';
  }
  
  // その他のエラー
  return `エラーが発生しました: ${error.message}`;
};

/**
 * プログラミング言語を検出する簡易関数
 * @param {string} code - 検出対象のコード
 * @returns {string} - 検出された言語名、不明な場合は'unknown'
 */
export const detectLanguage = (code) => {
  if (!code) return 'unknown';
  
  // 簡易的な言語検出ロジック
  if (code.includes('import React') || code.includes('useState') || code.includes('useEffect') || code.includes('jsx')) {
    return 'jsx';
  }
  
  if (code.includes('<html') || code.includes('<!DOCTYPE html')) {
    return 'html';
  }
  
  if (code.includes('function') && code.includes('{') && code.includes('}')) {
    return 'javascript';
  }
  
  if (code.includes('const') && code.includes('=>')) {
    return 'javascript';
  }
  
  if (code.includes('import') && code.includes('from')) {
    return 'javascript';
  }
  
  if (code.includes('class') && code.includes('extends')) {
    return 'javascript';
  }
  
  if (code.includes('def ') && code.includes(':')) {
    return 'python';
  }
  
  if (code.includes('#include') && (code.includes('<iostream>') || code.includes('<stdio.h>'))) {
    return 'cpp';
  }
  
  if (code.includes('public static void main')) {
    return 'java';
  }
  
  if (code.includes('package ') && code.includes('import ')) {
    return 'java';
  }
  
  return 'unknown';
};

/**
 * 指定された時間待機する
 * @param {number} ms - 待機時間（ミリ秒）
 * @returns {Promise<void>} - 指定時間後に解決するPromise
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * タイムアウト付きのPromise
 * @param {Promise} promise - 元のPromise
 * @param {number} timeoutMs - タイムアウト時間（ミリ秒）
 * @param {string} errorMsg - タイムアウト時のエラーメッセージ
 * @returns {Promise} - タイムアウト機能付きのPromise
 */
export const withTimeout = (promise, timeoutMs, errorMsg = 'リクエストがタイムアウトしました。') => {
  // タイムアウト用のPromise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMsg));
    }, timeoutMs);
  });
  
  // 元のPromiseとタイムアウトを競争させる
  return Promise.race([promise, timeoutPromise]);
}; 