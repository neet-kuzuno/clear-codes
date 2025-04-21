import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputBox from '../components/InputBox';
import OutputBox from '../components/OutputBox';
import ActionButton from '../components/ActionButton';
import SettingsButton from '../components/SettingsButton';
import useGemini from '../hooks/useGemini';
import useStorage from '../hooks/useStorage';
import { motion } from 'framer-motion';
import { saveData, getData } from '../utils/storage';

// 環境変数からバージョンを取得
const appVersion = process.env.PACKAGE_VERSION || '0.1.0';

function Popup() {
  const [inputText, setInputText] = useState('');
  const [outputDisplay, setOutputDisplay] = useState('empty'); // 'empty', 'loading', 'result', 'error'
  const { translateCode, result, setResult, loading, error } = useGemini();
  const { settings } = useStorage();
  
  // ポップアップが開かれたときに前回の状態を読み込む
  useEffect(() => {
    const loadPreviousState = async () => {
      try {
        const savedInput = await getData('lastInput');
        const savedOutput = await getData('lastOutput');
        
        if (savedInput) {
          setInputText(savedInput);
        }
        
        if (savedOutput) {
          setResult(savedOutput);
        }
      } catch (err) {
        console.error('前回の状態の読み込みに失敗しました:', err);
      }
    };
    
    loadPreviousState();
  }, [setResult]);
  
  // 入力テキストが変更されたときの処理
  const handleInputChange = (event) => {
    const newInput = event.target.value;
    setInputText(newInput);
    
    // 入力テキストをストレージに保存
    saveData('lastInput', newInput).catch(err => {
      console.error('入力テキストの保存に失敗しました:', err);
    });
  };

  // テキスト翻訳を実行する関数
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setOutputDisplay("loading");
    try {
      await translateCode(inputText);
      setOutputDisplay("result");
    } catch (e) {
      setOutputDisplay("error");
    }
  };
  
  // 再生成を実行する関数
  const handleRegenerate = async () => {
    if (!inputText.trim() || !result) return;
    
    setOutputDisplay("loading");
    try {
      await translateCode(inputText, true); // 再生成フラグをtrueに設定
      setOutputDisplay("result");
    } catch (e) {
      setOutputDisplay("error");
    }
  };

  // 設定画面に移動する関数
  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage();
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
        <motion.div 
          className="button-container"
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.25, 
            ease: "easeOut",
            delay: 0,
            type: "tween"
          }}
        > 
          <ActionButton 
            onClick={handleTranslate}
            isLoading={loading} 
            disabled={!inputText.trim()}
          >
            Run
          </ActionButton>
        </motion.div>
        <div className="h-1/2 w-full">
          <OutputBox
            outputDisplay={outputDisplay}
            result={result}
            error={error}
            onRegenerate={handleRegenerate}
            className="w-full"
          />
        </div>
      </main>
    </div>
  );
}

export default Popup; 