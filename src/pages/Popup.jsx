import React, { useState } from 'react';
import Header from '../components/Header';
import InputBox from '../components/InputBox';
import OutputBox from '../components/OutputBox';
import ActionButton from '../components/ActionButton';
import SettingsButton from '../components/SettingsButton';
import useGemini from '../hooks/useGemini';
import useStorage from '../hooks/useStorage';

// 環境変数からバージョンを取得
const appVersion = process.env.PACKAGE_VERSION || '0.1.0';

function Popup() {
  const [inputText, setInputText] = useState('');
  const { translateCode, result, loading, error } = useGemini();
  const { settings } = useStorage();
  
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    // APIキーが設定されているか確認
    if (!settings.apiKey) {
      alert('APIキーが設定されていません。設定画面でAPIキーを入力してください。');
      handleOpenSettings();
      return;
    }
    
    // Gemini APIを呼び出して翻訳を実行
    await translateCode(inputText, 'code', { 
      level: settings.languageMode || 'simple' 
    });
  };

  // 設定画面に移動する関数
  const handleOpenSettings = () => {
    // Chrome拡張機能の場合
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // 通常のWeb環境の場合（開発環境など）
      window.open('options.html', '_blank');
    }
  };

  // カスタムヘッダースタイル
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
  };

  const titleStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    margin: '0'
  };

  return (
    <div className="popup-container">
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Clear Codes v{appVersion}</h1>
        </div>
        <div>
          <SettingsButton onClick={handleOpenSettings} />
        </div>
      </div>
      <main className="main-content">
        <InputBox 
          value={inputText} 
          onChange={handleInputChange} 
          placeholder="ここにコードやエラーメッセージを入力してください"
        />
        <div className="button-container"> 
          <ActionButton 
            onClick={handleTranslate} 
            isLoading={loading} 
            disabled={!inputText.trim()}
          >
            Run
          </ActionButton>
        </div>
        <OutputBox 
          outputText={result || ''} 
          errorText={error} 
          isLoading={loading} 
        />
      </main>
    </div>
  );
}

export default Popup; 