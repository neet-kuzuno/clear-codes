import React, { useState, useEffect } from 'react';
import useStorage from '../hooks/useStorage';

function Options() {
  const { settings, updateApiKey, loading } = useStorage();
  const [apiKey, setApiKey] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  // 初期ロード時に設定を取得
  useEffect(() => {
    console.log('Options component loaded');
    
    if (settings.apiKey) {
      console.log('API Key found in settings');
      setApiKey(settings.apiKey);
    } else {
      console.log('No API Key found in settings');
    }
    
    // デバッグ情報を取得
    setDebugInfo(JSON.stringify({
      chromeAvailable: typeof chrome !== 'undefined',
      storageAvailable: typeof chrome !== 'undefined' && !!chrome.storage,
      settingsLoaded: !!settings
    }, null, 2));
  }, [settings.apiKey, settings]);

  // APIキーを保存する処理
  const handleSave = async () => {
    try {
      console.log('Attempting to save API Key:', apiKey.substring(0, 5) + '...');
      await updateApiKey(apiKey);
      alert('APIキーが保存されました');
      console.log('API Key saved successfully');
    } catch (error) {
      alert('保存中にエラーが発生しました: ' + error.message);
      console.error('Error saving API Key:', error);
    }
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 dark:bg-gray-900 dark:text-white">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-6">
            Clear Codes 設定
          </h1>
          
          {/* APIキー設定 */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1 dark:text-gray-300">
                Google Gemini APIキー
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="APIキーを入力してください"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400">
                  Google AI Studio
                </a>
                からAPIキーを取得できます。
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 dark:text-gray-300">その他の設定</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                テーマ設定、翻訳モードなどの機能は近日公開予定です。
              </p>
            </div>
          </div>
          
          {/* デバッグ情報（開発中のみ表示） */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-4 p-2 border border-gray-200 rounded">
              <summary className="text-xs text-gray-500">デバッグ情報</summary>
              <pre className="mt-2 p-2 text-xs bg-gray-100 rounded overflow-auto max-h-40">
                {debugInfo}
              </pre>
            </details>
          )}
          
          {/* フッター */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="flex items-center">
              Clear Codes v{process.env.PACKAGE_VERSION || '0.1.0'}
            </div>
            <button 
              className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Options; 