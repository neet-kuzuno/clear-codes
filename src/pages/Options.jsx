import React, { useState, useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import { KeyIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function Options() {
  const { settings, updateApiKey, loading } = useStorage();
  const [apiKey, setApiKey] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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

  // 保存成功後、表示を元に戻すタイマー
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // APIキーを保存する処理
  const handleSave = async () => {
    try {
      console.log('Attempting to save API Key:', apiKey.substring(0, 5) + '...');
      await updateApiKey(apiKey);
      setSaveSuccess(true);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
      <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* 明示的なIDをギアアイコンコンテナとアイコンに追加 */}
              <div id="gear-icon-container">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="white" 
                  id="gear-icon"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Clear Codes 設定</h1>
            </div>
            <div className="text-sm text-gray-300">v{process.env.PACKAGE_VERSION || '0.1.0'}</div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* APIキー設定 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-100">API設定</h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            
            <div className="p-5 bg-gray-750 rounded-lg border border-gray-700 shadow-inner">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-gray-300">
                Google Gemini APIキー
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="APIキーを入力してください"
                  className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
              </div>
              
              <p className="mt-2 text-sm text-gray-400">
                <a 
                  href="https://ai.google.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >
                  Google AI Studio
                </a>
                からAPIキーを取得できます。
              </p>
            </div>
          </div>
          
          {/* その他の設定セクション */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-100">その他の設定</h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            
            <div className="p-5 bg-gray-750 rounded-lg border border-gray-700 shadow-inner">
              <div className="flex items-center space-x-3 opacity-60">
                <div className="p-2 bg-gray-700 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-gray-400">テーマ設定、翻訳モードなどの機能は近日公開予定です。</span>
              </div>
            </div>
          </div>
          
          {/* デバッグ情報（開発中のみ表示） */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-3 border border-gray-700 rounded-lg bg-gray-800">
              <summary className="text-xs text-gray-400 cursor-pointer">デバッグ情報</summary>
              <pre className="mt-2 p-2 text-xs bg-gray-900 rounded overflow-auto max-h-40 text-gray-300">
                {debugInfo}
              </pre>
            </details>
          )}
        </div>
        
        {/* フッター */}
        <div className="px-6 py-4 bg-gray-850 border-t border-gray-700 flex items-center justify-end">
          <button 
            className={`
              px-5 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500
              flex items-center space-x-2 font-medium
              ${saveSuccess 
                ? 'bg-green-600 hover:bg-green-700' 
                : loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'}
            `}
            onClick={handleSave}
            disabled={loading || saveSuccess}
          >
            {saveSuccess ? (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                <span>保存しました</span>
              </>
            ) : loading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <span>設定を保存</span>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        &copy; 2023-2024 Clear Codes - All rights reserved
      </div>
    </div>
  );
}

export default Options; 